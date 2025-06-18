import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Input } from '../components/Input/Input';
import { Select } from '../components/Select/Select';
import { Button } from '../components/Button/Button';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import './styles.css';

interface TipoRelatorio {
  id: number;
  tipo: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoRelatorioId, setTipoRelatorioId] = useState('');
  const [tiposRelatorio, setTiposRelatorio] = useState<TipoRelatorio[]>([]);
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    tipoRelatorioId: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ nome: '', descricao: '', tipoRelatorioId: '' });

    // Validação
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      descricao: descricao.trim() === '' ? 'Descrição é obrigatória' : '',
      tipoRelatorioId: tipoRelatorioId === '' ? 'Tipo de relatório é obrigatório' : ''
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/relatorios', {
        nome,
        descricao,
        tipo_relatorio_id: Number(tipoRelatorioId)
      });

      // Mostra o popup de sucesso
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
        setTipoRelatorioId('');
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
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do relatório"
              error={errors.nome}
            />

            <Input
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição do relatório"
              error={errors.descricao}
            />

            <Select
              label="Tipo do Relatório"
              value={tipoRelatorioId}
              onChange={(e) => setTipoRelatorioId(e.target.value)}
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