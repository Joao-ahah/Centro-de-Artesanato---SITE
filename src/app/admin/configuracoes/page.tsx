'use client';

import React, { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('geral');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  // Estados para configurações gerais
  const [configGeral, setConfigGeral] = useState({
    nomeSite: 'Centro de Artesanato',
    descricaoSite: 'Descubra produtos artesanais únicos feitos à mão por artesãos de todo o Brasil',
    emailContato: 'contato@centroartesanato.com',
    telefoneContato: '(11) 99999-9999',
    enderecoCompleto: 'Rua das Artes, 123 - Centro - São Paulo/SP',
    horarioFuncionamento: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 14h',
    redesSociais: {
      facebook: 'https://facebook.com/centroartesanato',
      instagram: 'https://instagram.com/centroartesanato',
      twitter: 'https://twitter.com/centroartesanato',
      youtube: 'https://youtube.com/centroartesanato'
    }
  });

  // Estados para configurações de e-commerce
  const [configEcommerce, setConfigEcommerce] = useState({
    moedaPadrao: 'BRL',
    taxaEntrega: 15.00,
    entregaGratis: 100.00,
    prazoEntrega: '5-10 dias úteis',
    metodosPagemento: {
      cartaoCredito: true,
      cartaoDebito: true,
      pix: true,
      boleto: true,
      transferencia: false
    },
    estoqueBaixo: 5,
    notificarEstoqueBaixo: true
  });

  // Estados para configurações de SEO
  const [configSEO, setConfigSEO] = useState({
    tituloSite: 'Centro de Artesanato - Produtos Artesanais Brasileiros',
    metaDescricao: 'Descubra produtos artesanais únicos feitos à mão por artesãos de todo o Brasil. Valorizando tradições e cultura brasileira.',
    palavrasChave: 'artesanato, artesanato brasileiro, produtos artesanais, feito à mão, cultura brasileira',
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: ''
  });

  // Estados para configurações de notificações
  const [configNotificacoes, setConfigNotificacoes] = useState({
    emailNovoPedido: true,
    emailEstoqueBaixo: true,
    emailNovoUsuario: true,
    emailNovoArtesao: true,
    smsNovoPedido: false,
    pushNovoPedido: true,
    frequenciaRelatorios: 'semanal'
  });

  const tabs = [
    { id: 'geral', nome: 'Geral', icon: '⚙️' },
    { id: 'ecommerce', nome: 'E-commerce', icon: '🛒' },
    { id: 'seo', nome: 'SEO', icon: '🔍' },
    { id: 'notificacoes', nome: 'Notificações', icon: '🔔' },
    { id: 'backup', nome: 'Backup', icon: '💾' },
    { id: 'sistema', nome: 'Sistema', icon: '🖥️' }
  ];

  const salvarConfiguracoes = async (tipo: string) => {
    setLoading(true);
    try {
      // Simular salvamento (em uma aplicação real, faria uma requisição à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensagem({ tipo: 'sucesso', texto: `Configurações de ${tipo} salvas com sucesso!` });
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar configurações. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const renderTabGeral = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configurações Gerais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Site
          </label>
          <input
            type="text"
            value={configGeral.nomeSite}
            onChange={(e) => setConfigGeral(prev => ({ ...prev, nomeSite: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de Contato
          </label>
          <input
            type="email"
            value={configGeral.emailContato}
            onChange={(e) => setConfigGeral(prev => ({ ...prev, emailContato: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone de Contato
          </label>
          <input
            type="tel"
            value={configGeral.telefoneContato}
            onChange={(e) => setConfigGeral(prev => ({ ...prev, telefoneContato: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Funcionamento
          </label>
          <input
            type="text"
            value={configGeral.horarioFuncionamento}
            onChange={(e) => setConfigGeral(prev => ({ ...prev, horarioFuncionamento: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Site
        </label>
        <textarea
          value={configGeral.descricaoSite}
          onChange={(e) => setConfigGeral(prev => ({ ...prev, descricaoSite: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Endereço Completo
        </label>
        <textarea
          value={configGeral.enderecoCompleto}
          onChange={(e) => setConfigGeral(prev => ({ ...prev, enderecoCompleto: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Redes Sociais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={configGeral.redesSociais.facebook}
              onChange={(e) => setConfigGeral(prev => ({ 
                ...prev, 
                redesSociais: { ...prev.redesSociais, facebook: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={configGeral.redesSociais.instagram}
              onChange={(e) => setConfigGeral(prev => ({ 
                ...prev, 
                redesSociais: { ...prev.redesSociais, instagram: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={configGeral.redesSociais.twitter}
              onChange={(e) => setConfigGeral(prev => ({ 
                ...prev, 
                redesSociais: { ...prev.redesSociais, twitter: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="url"
              value={configGeral.redesSociais.youtube}
              onChange={(e) => setConfigGeral(prev => ({ 
                ...prev, 
                redesSociais: { ...prev.redesSociais, youtube: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => salvarConfiguracoes('gerais')}
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações Gerais'}
      </button>
    </div>
  );

  const renderTabEcommerce = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configurações de E-commerce</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moeda Padrão
          </label>
          <select
            value={configEcommerce.moedaPadrao}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, moedaPadrao: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="BRL">Real Brasileiro (BRL)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Entrega (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={configEcommerce.taxaEntrega}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, taxaEntrega: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor para Entrega Grátis (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={configEcommerce.entregaGratis}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, entregaGratis: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prazo de Entrega
          </label>
          <input
            type="text"
            value={configEcommerce.prazoEntrega}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, prazoEntrega: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estoque Baixo (unidades)
          </label>
          <input
            type="number"
            value={configEcommerce.estoqueBaixo}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, estoqueBaixo: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Métodos de Pagamento</h4>
        <div className="space-y-3">
          {Object.entries(configEcommerce.metodosPagemento).map(([metodo, ativo]) => (
            <label key={metodo} className="flex items-center">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setConfigEcommerce(prev => ({
                  ...prev,
                  metodosPagemento: { ...prev.metodosPagemento, [metodo]: e.target.checked }
                }))}
                className="mr-2 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {metodo.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={configEcommerce.notificarEstoqueBaixo}
            onChange={(e) => setConfigEcommerce(prev => ({ ...prev, notificarEstoqueBaixo: e.target.checked }))}
            className="mr-2 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm text-gray-700">
            Notificar quando estoque estiver baixo
          </span>
        </label>
      </div>

      <button
        onClick={() => salvarConfiguracoes('e-commerce')}
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações de E-commerce'}
      </button>
    </div>
  );

  const renderTabSEO = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configurações de SEO</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título do Site
        </label>
        <input
          type="text"
          value={configSEO.tituloSite}
          onChange={(e) => setConfigSEO(prev => ({ ...prev, tituloSite: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-sm text-gray-500 mt-1">Máximo 60 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Descrição
        </label>
        <textarea
          value={configSEO.metaDescricao}
          onChange={(e) => setConfigSEO(prev => ({ ...prev, metaDescricao: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-sm text-gray-500 mt-1">Máximo 160 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Palavras-chave
        </label>
        <input
          type="text"
          value={configSEO.palavrasChave}
          onChange={(e) => setConfigSEO(prev => ({ ...prev, palavrasChave: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-sm text-gray-500 mt-1">Separe as palavras-chave com vírgulas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={configSEO.googleAnalytics}
            onChange={(e) => setConfigSEO(prev => ({ ...prev, googleAnalytics: e.target.value }))}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Tag Manager ID
          </label>
          <input
            type="text"
            value={configSEO.googleTagManager}
            onChange={(e) => setConfigSEO(prev => ({ ...prev, googleTagManager: e.target.value }))}
            placeholder="GTM-XXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={configSEO.facebookPixel}
            onChange={(e) => setConfigSEO(prev => ({ ...prev, facebookPixel: e.target.value }))}
            placeholder="123456789012345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <button
        onClick={() => salvarConfiguracoes('SEO')}
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações de SEO'}
      </button>
    </div>
  );

  const renderTabNotificacoes = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configurações de Notificações</h3>
      
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Notificações por Email</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.emailNovoPedido}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, emailNovoPedido: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Novo pedido recebido</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.emailEstoqueBaixo}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, emailEstoqueBaixo: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Estoque baixo</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.emailNovoUsuario}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, emailNovoUsuario: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Novo usuário cadastrado</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.emailNovoArtesao}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, emailNovoArtesao: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Novo artesão cadastrado</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Outras Notificações</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.smsNovoPedido}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, smsNovoPedido: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">SMS para novos pedidos</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={configNotificacoes.pushNovoPedido}
              onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, pushNovoPedido: e.target.checked }))}
              className="mr-2 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Push notifications para novos pedidos</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequência de Relatórios
        </label>
        <select
          value={configNotificacoes.frequenciaRelatorios}
          onChange={(e) => setConfigNotificacoes(prev => ({ ...prev, frequenciaRelatorios: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
          <option value="nunca">Nunca</option>
        </select>
      </div>

      <button
        onClick={() => salvarConfiguracoes('notificações')}
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações de Notificações'}
      </button>
    </div>
  );

  const renderTabBackup = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Backup e Restauração</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informação sobre Backup
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Os backups são realizados automaticamente todos os dias às 2:00 AM. 
                Você pode fazer backup manual ou restaurar dados de backups anteriores.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Backup Manual</h4>
          <p className="text-sm text-gray-600 mb-4">
            Crie um backup completo do sistema incluindo banco de dados, arquivos e configurações.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Criar Backup Agora
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Restaurar Backup</h4>
          <p className="text-sm text-gray-600 mb-4">
            Restaure o sistema a partir de um backup anterior. Esta ação não pode ser desfeita.
          </p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
            Restaurar Backup
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Backups Recentes</h4>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamanho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date().toLocaleDateString('pt-BR')} - 02:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Automático
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  245 MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Download</button>
                  <button className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabSistema = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Versão do Sistema</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Versão:</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Última atualização:</span>
              <span className="text-sm font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ambiente:</span>
              <span className="text-sm font-medium">Produção</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usuários ativos:</span>
              <span className="text-sm font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Produtos cadastrados:</span>
              <span className="text-sm font-medium">567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pedidos hoje:</span>
              <span className="text-sm font-medium">23</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Manutenção do Sistema</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md">
            Limpar Cache
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Otimizar Banco
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            Verificar Integridade
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Logs do Sistema</h4>
        <div className="bg-gray-100 rounded-md p-4 max-h-64 overflow-y-auto">
          <div className="text-sm font-mono space-y-1">
            <div>[{new Date().toLocaleString('pt-BR')}] INFO: Sistema iniciado com sucesso</div>
            <div>[{new Date().toLocaleString('pt-BR')}] INFO: Backup automático concluído</div>
            <div>[{new Date().toLocaleString('pt-BR')}] INFO: Cache limpo automaticamente</div>
            <div>[{new Date().toLocaleString('pt-BR')}] INFO: Usuário admin logado</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral':
        return renderTabGeral();
      case 'ecommerce':
        return renderTabEcommerce();
      case 'seo':
        return renderTabSEO();
      case 'notificacoes':
        return renderTabNotificacoes();
      case 'backup':
        return renderTabBackup();
      case 'sistema':
        return renderTabSistema();
      default:
        return renderTabGeral();
    }
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>
              <p className="text-gray-600">Gerencie as configurações gerais do Centro de Artesanato</p>
            </div>

            {/* Mensagem de feedback */}
            {mensagem && (
              <div className={`mb-6 p-4 rounded-md ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {mensagem.texto}
                <button 
                  onClick={() => setMensagem(null)}
                  className="float-right text-lg font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.nome}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 