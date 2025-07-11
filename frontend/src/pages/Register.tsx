import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Input } from '../components/Input/Input';
import { Select } from '../components/Select/Select';
import { TextArea } from '../components/TextArea/TextArea';
import { Button } from '../components/Button/Button';
import { ParameterInputForm } from '../components/ParameterForm/ParameterInputForm';
import { ParametersTable } from '../components/ParametersTable/ParametersTable';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import './styles.css';

interface TipoRelatorio {
  id: number;
  tipo: string;
}

interface Parameter {
  nome: string;
  tipo: string;
  tamanho: string;
  label: string;
}

// Lista de palavras proibidas
const PROHIBITED_WORDS = [
  'insert',
  'update',
  'delete',
  'drop',
  'truncate',
  'alter',
  'create',
  'replace',
  'exec',
  'execute',
  'relatorios',
  'tipos_relatorio',
  ';',
  '--',
  '/*',
  '*/'
];

export const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [query, setQuery] = useState('');
  const [tipoRelatorioId, setTipoRelatorioId] = useState('');
  const [tiposRelatorio, setTiposRelatorio] = useState<TipoRelatorio[]>([]);
  const [hasParameters, setHasParameters] = useState(false);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    query: '',
    tipoRelatorioId: ''
  });

  // Refs para os campos do formulário
  const nomeRef = useRef<HTMLDivElement>(null);
  const descricaoRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLDivElement>(null);
  const tipoRelatorioRef = useRef<HTMLDivElement>(null);

  // Função para verificar palavras proibidas
  const checkProhibitedWords = (value: string) => {
    const lowerValue = value.toLowerCase();
    return PROHIBITED_WORDS.some(word => lowerValue.includes(word.toLowerCase()));
  };

  // Handler para mudança na query com validação em tempo real
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (checkProhibitedWords(value)) {
      setErrors(prev => ({ ...prev, query: 'Comando não autorizado' }));
    } else {
      setErrors(prev => ({ ...prev, query: '' }));
    }
  };

  // Validação em tempo real para campos obrigatórios
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNome(value);
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, nome: 'Nome é obrigatório' }));
    } else {
      setErrors(prev => ({ ...prev, nome: '' }));
    }
  };

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescricao(value);
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, descricao: 'Descrição é obrigatória' }));
    } else {
      setErrors(prev => ({ ...prev, descricao: '' }));
    }
  };

  const handleTipoRelatorioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipoRelatorioId(value);
    if (value === '') {
      setErrors(prev => ({ ...prev, tipoRelatorioId: 'Tipo de relatório é obrigatório' }));
    } else {
      setErrors(prev => ({ ...prev, tipoRelatorioId: '' }));
    }
  };

  const handleAddParameter = (parameter: Parameter) => {
    // Verificar se já existe um parâmetro com o mesmo nome
    const parameterExists = parameters.some(
      p => p.nome.toLowerCase() === parameter.nome.toLowerCase()
    );

    if (parameterExists) {
      Swal.fire({
        title: 'Erro',
        text: `Já existe um parâmetro com o nome "${parameter.nome}"`,
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
      return;
    }

    setParameters([...parameters, parameter]);
  };

  const handleDeleteParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchTiposRelatorio = async () => {
      try {
        const response = await api.get('/tipos-relatorio');
        setTiposRelatorio(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de relatório:', error);
      }
    };

    fetchTiposRelatorio();
  }, []);

  const validateForm = () => {
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      descricao: descricao.trim() === '' ? 'Descrição é obrigatória' : '',
      query: query.trim() === '' ? 'Query é obrigatória' : checkProhibitedWords(query) ? 'Comando não autorizado' : '',
      tipoRelatorioId: tipoRelatorioId === '' ? 'Tipo de relatório é obrigatório' : ''
    };

    // Encontrar todos os parâmetros na query (formato :nome_parametro)
    const queryParamsMatch = query.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const queryParams = queryParamsMatch.map(p => p.substring(1)); // Remove o : do início

    // Se existem parâmetros na query mas marcou que não tem parâmetros
    if (queryParams.length > 0 && !hasParameters) {
      newErrors.query = `Foram encontrados os seguintes parâmetros na query: ${queryParams.join(', ')}. Marque "Sim" na opção "A query tem parâmetros?" e adicione-os.`;
    }
    // Se marcou que tem parâmetros, fazer as validações
    else if (hasParameters) {

      // Se encontrou parâmetros na query mas não tem nenhum na tabela
      if (queryParams.length > 0 && parameters.length === 0) {
        newErrors.query = `Foram encontrados os seguintes parâmetros na query que não foram adicionados: ${queryParams.join(', ')}`;
      }
      // Se não encontrou parâmetros na query mas marcou que tem parâmetros
      else if (queryParams.length === 0) {
        newErrors.query = 'Você marcou que a query tem parâmetros, mas nenhum parâmetro foi encontrado na query (formato :nome_parametro)';
      }
      // Se tem parâmetros na query e na tabela, verificar se todos correspondem
      else if (parameters.length > 0) {
        // Verificar parâmetros da tabela que não estão na query
        const missingInQuery = parameters.filter(param => !queryParams.includes(param.nome));
        // Verificar parâmetros da query que não estão na tabela
        const missingInTable = queryParams.filter(param => !parameters.find(p => p.nome === param));

        if (missingInQuery.length > 0) {
          newErrors.query = `Os seguintes parâmetros da tabela não foram encontrados na query: ${missingInQuery.map(p => p.nome).join(', ')}`;
        }
        else if (missingInTable.length > 0) {
          newErrors.query = `Os seguintes parâmetros da query não foram adicionados na tabela: ${missingInTable.join(', ')}`;
        }
      }
    }

    setErrors(newErrors);
    
    // Se houver erros, faz o scroll para o primeiro campo com erro
    if (Object.values(newErrors).some(error => error !== '')) {
      setTimeout(() => {
        scrollToFirstError(newErrors);
      }, 100);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Primeiro, criar a query
      const queryResponse = await api.post('/queries', {
        query: query
      });

      // Depois, criar o relatório com a referência para a query
      await api.post('/relatorios', {
        nome,
        descricao,
        query_id: queryResponse.data.id,
        tipo_relatorio_id: Number(tipoRelatorioId),
        has_parameters: hasParameters,
        parameters: hasParameters ? parameters : []
      });

      const result = await Swal.fire({
        title: 'Relatório cadastrado com sucesso.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Cadastrar novo relatório',
        cancelButtonText: 'Voltar para tabela',
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: '#fff',
        customClass: {
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel',
          actions: 'swal2-actions'
        }
      });

      if (result.isConfirmed) {
        // Limpa o formulário para um novo cadastro
        setNome('');
        setDescricao('');
        setQuery('');
        setTipoRelatorioId('');
        setHasParameters(false);
        setParameters([]);
        setErrors({
          nome: '',
          descricao: '',
          query: '',
          tipoRelatorioId: ''
        });
      } else {
        // Volta para a tabela
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao cadastrar relatório:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao cadastrar o relatório.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      }).then(() => {
        // Chama o scroll para o primeiro erro após o modal ser fechado
        scrollToFirstError(errors);
      });
    }
  };

  // Função para fazer scroll para o primeiro erro
  const scrollToFirstError = (errors: Record<string, string>) => {
    const errorFields = {
      nome: nomeRef,
      descricao: descricaoRef,
      query: queryRef,
      tipoRelatorioId: tipoRelatorioRef
    };

    // Encontra o primeiro campo com erro
    const firstErrorField = Object.entries(errors).find(([_, value]) => value !== '');
    
    if (firstErrorField) {
      const [fieldName] = firstErrorField;
      const ref = errorFields[fieldName as keyof typeof errorFields];
      
      if (ref.current) {
        // Scroll suave para o elemento com erro
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="content-wrapper">
        <div className="register-container">
          <Header
            title="Cadastrar Relatório"
            subtitle="Preencha os campos abaixo para cadastrar um novo relatório"
            showButton={false}
          />
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-row">
              <div className="input-group" ref={nomeRef}>
                <Input
                  label={"Nome"}
                  labelExtra={<span className="required-asterisk">*</span>}
                  value={nome}
                  onChange={handleNomeChange}
                  placeholder="Digite o nome do relatório"
                  error={errors.nome}
                />
              </div>
              <div className="input-group" ref={tipoRelatorioRef}>
                <Select
                  label={"Tipo do Relatório"}
                  labelExtra={<span className="required-asterisk">*</span>}
                  value={tipoRelatorioId}
                  onChange={handleTipoRelatorioChange}
                  options={tiposRelatorio.map(tipo => ({
                    value: tipo.id.toString(),
                    label: tipo.tipo
                  }))}
                  error={errors.tipoRelatorioId}
                />
              </div>
            </div>

            <div ref={queryRef}>
              <TextArea
                label={"Query"}
                labelExtra={<span className="required-asterisk">*</span>}
                value={query}
                onChange={handleQueryChange}
                placeholder="Digite a query SQL do relatório"
                error={errors.query}
                maxLength={2000}
                showCounter
              />
            </div>

            <div className="available-tables">
              <div className="available-tables-title">Tabelas disponíveis para consulta</div>
              <div className="table-tags">
                <span className="table-tag">clientes</span>
                <span className="table-tag">produtos</span>
                <span className="table-tag">vendas</span>
                <span className="table-tag">venda_itens</span>
              </div>
            </div>

            <div ref={descricaoRef}>
              <TextArea
                label={"Descrição"}
                labelExtra={<span className="required-asterisk">*</span>}
                value={descricao}
                onChange={handleDescricaoChange}
                placeholder="Digite a descrição do relatório"
                error={errors.descricao}
                maxLength={400}
                showCounter
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="parameters-section">
              <div className="parameters-header">
                <label className="parameters-label">
                  A query tem parâmetros?
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="hasParameters"
                        value="yes"
                        checked={hasParameters}
                        onChange={() => setHasParameters(true)}
                      />
                      Sim
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="hasParameters"
                        value="no"
                        checked={!hasParameters}
                        onChange={() => setHasParameters(false)}
                      />
                      Não
                    </label>
                  </div>
                </label>
              </div>

              {hasParameters && (
                <>
                  <ParameterInputForm onAddParameter={handleAddParameter} />
                  <ParametersTable
                    parameters={parameters}
                    onDeleteParameter={handleDeleteParameter}
                  />
                </>
              )}
            </div>

            <div className="form-actions">
              <Button
                variant="outline-custom"
                onClick={() => navigate('/')}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                Cadastrar Relatório
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 