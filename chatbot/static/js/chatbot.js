// Função para adicionar uma nova mensagem à interface
// Função para adicionar uma nova mensagem à interface
// Função para adicionar uma nova mensagem à interface
function appendMessage(message, sender, isTyping = false) {
	const messagesContainer = document.getElementById("messages");
	const messageBubble = document.createElement("div");

	messageBubble.className = `message ${sender === "Você" ? "user" : "assistant"}`;

	if (isTyping) {
		// Verifica se já existe um status "digitando..."
		if (document.getElementById("typing-status")) return;

		messageBubble.id = "typing-status"; // Adiciona ID para o status "digitando..."
		messageBubble.innerHTML = `
			<img src="/static/images/robot-avatar.png" class="avatar" alt="Assistente">
			<span class="typing-indicator"><b>Assistente:</b> Digitando...</span>
		`;
	} else {
		// Substitui quebras de linha \n por <br> para visualização correta
		const formattedMessage = message.replace(/\n/g, "<br>");
		
		messageBubble.innerHTML = sender === "Você"
			? `<span class="sender">${sender}:</span> ${formattedMessage}`
			: `
				<img src="/static/images/robot-avatar.png" class="avatar" alt="Assistente">
				<span class="sender">${sender}:</span> ${formattedMessage}
			`;
	}

	messagesContainer.appendChild(messageBubble);
	messagesContainer.scrollTop = messagesContainer.scrollHeight; // Rolagem automática
}


// Função para carregar o histórico de mensagens
async function loadInitialMessages(context) {
	if (!context) {
		appendMessage(
			"Olá! Eu sou o assistente virtual. Como posso te ajudar hoje?\n\n" + 
                "Aqui estão algumas opções comuns para começar:\n" +
				"1. Quais são os horários de funcionamento?\n" +
				"2. Como posso alterar ou cancelar um pedido?\n" +
				"3. Quais são as formas de pagamento aceitas?\n" +
				"4. Como rastrear meu pedido?\n" +
				"5. Tenho dúvidas sobre garantia ou devolução.\n" +
				"6. Falar com um atendente.\n\n" +
				"Basta selecionar uma opção ou me fazer uma pergunta!",
			"Assistente"
		);
		console.warn("Contexto inicial não fornecido.");
		return;
	}

	const lines = context.split("\n");
	lines.forEach((line) => {
		if (line.startsWith("Usuário:")) {
			appendMessage(line.replace("Usuário: ", ""), "Você");
		} else if (line.startsWith("Assistente:")) {
			appendMessage(line.replace("Assistente: ", ""), "Assistente");
		}
	});
}

// Função para enviar uma nova mensagem
async function sendMessage() {
	const userInput = document.getElementById("user_input").value.trim();
	if (!userInput) return;

	// Exibe a mensagem do usuário
	appendMessage(userInput, "Você");
	document.getElementById("user_input").value = "";

	// Adiciona o status de digitação da assistente
	appendMessage("", "Assistente", true);

	const csrfToken = document.getElementById("csrf_token").value;

	try {
		const response = await fetch("/chatbot/chat/", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"X-CSRFToken": csrfToken,
			},
			body: `user_input=${encodeURIComponent(userInput)}`,
		});

		const data = await response.json();

		const typingStatus = document.getElementById("typing-status");
		if (typingStatus) typingStatus.remove();

		// Exibe a resposta da assistente
		appendMessage(data.message, "Assistente");
	} catch (error) {
		const typingStatus = document.getElementById("typing-status");
		if (typingStatus) typingStatus.remove();

		appendMessage(
			"Houve um erro ao processar sua mensagem. Tente novamente.",
			"Assistente"
		);
	}
}

// Função para tratar o envio de mensagem ao pressionar Enter
function handleKeyPress(event) {
	if (event.key === "Enter") sendMessage();
}

// Carregar o histórico quando a página for carregada
window.onload = function () {
	fetchInitialMessages();
};

// Função para buscar as mensagens iniciais do servidor
async function fetchInitialMessages() {
	// Obtém o CSRF token, caso seja necessário
	const csrfToken = document.getElementById("csrf_token")?.value;

	try {
		const response = await fetch("/chatbot/initial-context/", {
			// Substitua pela rota correta
			method: "GET", // Use GET se estiver apenas recuperando o histórico
			headers: {
				"Content-Type": "application/json",
				...(csrfToken && { "X-CSRFToken": csrfToken }),
			},
		});

		if (!response.ok) {
			throw new Error(`Erro na requisição: ${response.status}`);
		}

		const data = await response.json();

		// Popula o chat com o contexto inicial
		if (data.context) {
			loadInitialMessages(data.context); // Usa a função existente para processar o contexto
		} else {
			console.warn("Nenhum contexto inicial encontrado na resposta.");
		}
	} catch (error) {
		console.error("Erro ao buscar mensagens iniciais:", error);
		appendMessage(
			"Erro ao carregar mensagens iniciais. Tente recarregar a página.",
			"Assistente"
		);
	}
}

// Atualização do window.onload
window.onload = async function () {
	try {
		const response = await fetch("/chatbot/initial-context/", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Erro na requisição: ${response.status}`);
		}

		const data = await response.json();

		loadInitialMessages(data.context);
	} catch (error) {
		console.error("Erro ao carregar o contexto inicial:", error);
	}
};
