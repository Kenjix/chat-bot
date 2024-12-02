from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate

businessName = "Assistência ao Cliente"
faq_menu = """
    1. Quais exames estão disponíveis para agendamento?
    2. Como faço para agendar um exame?
    3. Preciso de algum documento para realizar o exame?
    4. Qual é o endereço da unidade mais próxima?
    5. Posso reagendar ou cancelar meu exame?
    6. Quais os horários disponíveis para exames?
    7. Falar com um atendente.
"""

#respostas fictícias para cada item do menu
faq_responses = {
    "1": "Os exames realizados incluem: Raios-X, Ultrassonografia, Tomografia, Ressonância Magnética e Hemograma Completo.",
    "2": "Você pode agendar um exame pelo nosso site, aplicativo ou entrando em contato com a unidade mais próxima.",
    "3": "Sim, é necessário um documento de identificação e a solicitação médica.",
    "4": """Temos duas unidades disponíveis:
        - Unidade Centro: Rua Exemplo, 123, Centro, Cidade Fictícia.
        - Unidade Norte: Avenida Imaginária, 456, Bairro dos Sonhos, Cidade Fictícia.""",
    "5": "Sim, é possível reagendar ou cancelar seu exame pelo site, aplicativo ou pelo atendimento ao cliente.",
    "6": "Os horários disponíveis para exames variam conforme a unidade. Consulte diretamente pelo site ou aplicativo.",
    "7": "Por favor, aguarde. Estamos transferindo você para um atendente humano.",
}


#template do prompt usando ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente virtual para {businessName}. Seu objetivo é ajudar os usuários com questões relacionadas exclusivamente ao negócio e às opções do menu de Perguntas Frequentes (FAQ)."),
    ("system", "Menu de Perguntas Frequentes (FAQ):\n{faq_menu}"),
    ("system", "Se o usuário fizer uma pergunta fora do escopo, você deve educadamente informar que só pode ajudar com as opções apresentadas no menu e apresentar o menu novamente."),
    ("system", "Sempre responda em português do Brasil, de forma clara, objetiva e apenas dentro do escopo das informações fornecidas."),
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