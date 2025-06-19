import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Input } from '../components/Input/Input';
import { Select } from '../components/Select/Select';
import { TextArea } from '../components/TextArea/TextArea';
import { Button } from '../components/Button/Button';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import './styles.css';

interface TipoRelatorio {
  id: number;
  tipo: string;
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
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    query: '',
    tipoRelatorioId: ''
  });

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

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await api.post('/relatorios', {
        nome,
        descricao,
        query,
        tipo_relatorio_id: Number(tipoRelatorioId)
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
      });
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
            <Input
              label="Nome"
              value={nome}
              onChange={handleNomeChange}
              placeholder="Digite o nome do relatório"
              error={errors.nome}
            />

            <Input
              label="Descrição"
              value={descricao}
              onChange={handleDescricaoChange}
              placeholder="Digite a descrição do relatório"
              error={errors.descricao}
            />

            <TextArea
              label="Query"
              value={query}
              onChange={handleQueryChange}
              placeholder="Digite a query SQL do relatório"
              error={errors.query}
            />

            <div className="available-tables">
              <div className="available-tables-title">Tabelas disponíveis para consulta</div>
              <div className="table-tags">
                <span className="table-tag">clientes</span>
                <span className="table-tag">produtos</span>
                <span className="table-tag">vendas</span>
                <span className="table-tag">venda_itens</span>
              </div>
            </div>

            <Select
              label="Tipo do Relatório"
              value={tipoRelatorioId}
              onChange={handleTipoRelatorioChange}
              options={tiposRelatorio.map(tipo => ({
                value: tipo.id.toString(),
                label: tipo.tipo
              }))}
              error={errors.tipoRelatorioId}
            />

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