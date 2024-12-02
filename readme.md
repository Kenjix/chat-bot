# Django Chat com IA (FAQ)

## 📋 Sobre o Projeto

Este é um projeto de **chat interativo** desenvolvido em Django que utiliza **inteligência artificial** para responder às perguntas frequentes (FAQ) dos usuários. Quando o usuário não encontra a resposta correta ou está com dúvidas, o sistema utiliza um modelo de IA baseado no **Llama 3.1** para fornecer suporte adicional e orientar o usuário na navegação pelos menus.

Além disso, o sistema mantém um **histórico de conversas** baseado na sessão do Django, permitindo que o usuário acompanhe o contexto e as respostas durante a interação.

---

## 🛠️ Tecnologias Utilizadas

- **Django**: Framework web backend para gerenciar rotas, lógica do chat, API e sessões.
- **LangChain**: Para gerenciamento do fluxo de conversação e integração com o modelo de IA.
- **Ollama**: Biblioteca para acessar e executar o modelo Llama 3 localmente.
- **Python-Decouple**: Para gerenciar configurações sensíveis, carregando variáveis de um arquivo `.env` de forma segura e organizada.

---

## 📦 Funcionalidades

- **Respostas automáticas** para perguntas frequentes (FAQ).
- **Suporte via IA** para perguntas não respondidas diretamente.
- **Histórico de conversas** baseado na sessão do Django.

---

## 🤖 Exemplos de Perguntas Suportadas

1. **Perguntas Frequentes:**

- "Qual o horário de atendimento?"
- "Quais os meios de pagamento disponíveis?"

2. **Respostas via IA:**

- Quando o usuário digita algo como: "Não sei como resolver meu problema", o modelo Llama 3 fornece orientações ou sugere um item do menu.

2. **Histórico de Conversas:**

- O histórico é salvo e exibido durante a sessão ativa, permitindo que o usuário veja perguntas e respostas anteriores.

---

## 📂 Estrutura do Projeto

    .
    ├── chatbot/               # App do chat
    │   ├── models.py          # Modelos de dados
    │   ├── views.py           # Lógica das views do chat
    │   ├── urls.py            # Rotas do app Chatbot
    │   ├── templates/         # Templates HTML
    |   ├── ai_model           # Lógica do modelo de IA
    │   └── utils.py           # Funções auxiliares (ex.: manipulação do )
    ├── core/                  # App principal do Django
    │   ├── models.py          # Modelos de dados
    │   ├── views.py           # Lógica das views principal
    │   ├── urls.py            # Rotas do app
    │   ├── templates/         # Templates HTML
    ├── project/               # Configurações do projeto Django
    │   ├── settings.py        # Configurações principais
    │   └── urls.py            # Rotas root
    ├── requirements.txt       # Dependências do projeto
    ├── .env                   # Configuração de Ambiente
    └── README.md              # Documentação do projeto

---

## ⚙️ Configuração de Ambiente

1. **Crie um arquivo .env na raiz do projeto**

    ```bash
    touch .env #Linux
    mkdir .env #Windows
    ```

2.  **Certifique-se de definir as variáveis de ambiente necessárias no arquivo .env:**
    
    ```bash
    DJANGO_SECRET_KEY='chaveaqui'
    ```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

1. **Python 3.12.7**
2. **Django 5.1.3** (instalado no ambiente virtual)
3. **Ollama 0.4.2** (para executar o modelo Llama 3)
4. **LangChain 0.3.19** (para gerenciar fluxos de conversação)

### Passo a Passo

1. **Clone este repositório**

   ```bash
   git clone https://github.com/Kenjix/chat-bot.git
   cd seu-repositorio
   ```

2. **Crie e ative o ambiente virtual**

    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    ```

3. **Instale as dependências**

    ```bash
    pip install -r requirements.txt
    ```

4. **Configure o Ollama**

- Instale o Ollama CLI conforme documentação oficial.
- Baixe o modelo llama3.1:8b:

    ```bash
    ollama pull llama3.1:8b
    ```

5. **Realize as migrações do Django**

    ```bash
    python manage.py migrate
    ```

6. **Inicie o servidor**

    ```bash
    python manage.py runserver
    ```

7. **Acesse a aplicação**

- Abra seu navegador e acesse: http://127.0.0.1:8000.