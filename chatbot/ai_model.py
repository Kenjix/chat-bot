from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate

businessName = "Assistência ao Cliente"
faq_menu = """
1. Quais são os horários de funcionamento?
2. Como posso alterar ou cancelar um pedido?
3. Quais são as formas de pagamento aceitas?
4. Como rastrear meu pedido?
5. Tenho dúvidas sobre garantia ou devolução.
6. Falar com um atendente.
"""

#respostas fictícias para cada item do menu
faq_responses = {
    "1": "Nosso horário de funcionamento é de segunda a sexta, das 9h às 18h, e aos sábados, das 9h às 13h.",
    "2": "Para alterar ou cancelar um pedido, entre na sua conta pelo site ou aplicativo e vá até a seção 'Meus Pedidos'.",
    "3": "Aceitamos as seguintes formas de pagamento: PIX, cartão de crédito (todas as bandeiras) e débito.",
    "4": "Você pode rastrear seu pedido acessando o link de rastreamento enviado por e-mail ou entrando em contato conosco.",
    "5": "Oferecemos garantia de 30 dias para defeitos de fabricação. Para devoluções, siga as instruções em nosso site.",
    "6": "Por favor, aguarde. Estamos transferindo você para um atendente humano.",
}

#template do prompt usando ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente virtual para {businessName}. Seu objetivo principal é ajudar os usuários com questões relacionadas ao negócio, incluindo o menu de Perguntas Frequentes (FAQ) e perguntas relevantes ao escopo da assistência."),
    ("system", "Menu de Perguntas Frequentes (FAQ):\n{faq_menu}"),
    ("system", "Se o usuário inserir uma opção inválida ou uma pergunta fora do escopo, seja educado, mostre o menu novamente e explique como você pode ajudar."),
    ("system", "Você deve responder somente em português do Brasil e ser sempre direto e objetivo nas orientações."),
    ("user", "{context}"),
    ("user", "{user_input}"),
    ("assistant", "Assistente: "),
])

#instanciando o modelo de ia
model = OllamaLLM(model="llama3.1:8b")

#funcao para gerar resposta do assistente virtual
def generate_response(context: str, user_input: str):
    """
    Gera uma resposta do assistente virtual com base no contexto e na entrada do usuário.
    """
    #verifica se o input do usuario corresponde a uma opção válida do FAQ
    if user_input in ["sair", "exit", "quit"]:
        context = ""
        response = "Obrigado por entrar em contato. Até logo!"
        return response, context
    elif user_input.strip() in faq_responses:
        response = faq_responses[user_input.strip()]
        context += f"Usuário: {user_input}\nAssistente: {response}\n"
        return response, context    
    else:
        #gera uma resposta usando o modelo
        filled_prompt = prompt.format(
            businessName=businessName,
            faq_menu=faq_menu,
            context=context,
            user_input=user_input
        )
        response = model.invoke(filled_prompt)

        #atualiza o contexto com a nova interacao
        context += f"Usuário: {user_input}\nAssistente: {response}\n"

        return response, context