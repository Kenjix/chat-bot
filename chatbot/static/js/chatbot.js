//adiciona uma nova mensagem no chat
function appendMessage(message, sender, isTyping = false) {
	const messagesContainer = document.getElementById("messages");
	const messageBubble = document.createElement("div");

	messageBubble.className = `message ${
		sender === "Usuário" ? "user" : "assistant"
	}`;

	if (isTyping) {
		//verifica o status "digitando..."
		if (document.getElementById("typing-status")) return;

		messageBubble.id = "typing-status"; //adiciona ID para o status "digitando..."
		messageBubble.innerHTML = `
			<img src="/static/images/robot-avatar.png" class="avatar" alt="Assistente">
			<span class="typing-indicator"><b>Assistente:</b> Digitando...</span>
		`;
	} else {
		//substitui quebras de linha \n por <br> para visualização correta
		const formattedMessage = message.replace(/\n/g, "<br>");

		messageBubble.innerHTML =
			sender === "Usuário"
				? `<span class="sender">Você:</span>${formattedMessage}`
				: `
			<img src="/static/images/robot-avatar.png" class="avatar" alt="Assistente">
			<span class="sender">${sender}:&nbsp;</span>${formattedMessage}
			`;
	}

	messagesContainer.appendChild(messageBubble);
	messagesContainer.scrollTop = messagesContainer.scrollHeight; //rolagem automática
}

//funcao para carregar o histórico de mensagens
async function loadInitialMessages(context) {
	if (!context) {
		appendMessage(
			`Olá! Eu sou o assistente virtual de agendamentos. Como posso te ajudar hoje?\n\n` +
				`Aqui estão algumas opções comuns para começar:\n` +
				`1. Quais exames estão disponíveis para agendamento?\n` +
				`2. Como faço para agendar um exame?\n` +
				`3. Preciso de algum documento para realizar o exame?\n` +
				`4. Qual é o endereço da unidade mais próxima?\n` +
				`5. Posso reagendar ou cancelar meu exame?\n` +
				`6. Quais os horários disponíveis para exames?\n\n` +
				`Basta selecionar uma opção ou me fazer uma pergunta!`,
			"Assistente"
		);
		console.warn("Contexto inicial não fornecido.");
		return;
	}

	//expressão regular para capturar as mensagens
	const regex = /(Usuário:|Assistente:)\s(.+?)(?=(Usuário:|Assistente:|$))/gs;

	let match;
	while ((match = regex.exec(context)) !== null) {
		//determina o remetente e mensagem
		const sender = match[1].replace(":", "").trim(); //remove ":" e espaços extras
		const message = match[2].trim(); //captura o conteudo da mensagem
		appendMessage(message, sender); //adiciona a mensagem no chat
	}
}

//funcao para enviar uma nova mensagem
async function sendMessage() {
	const userInput = document.getElementById("user_input").value.trim();
	if (!userInput) return;

	//exibe a mensagem do usuario
	appendMessage(userInput, "Usuário");
	document.getElementById("user_input").value = "";

	//adiciona o status de digitando do assistente
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

		//exibe a resposta do assistente
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
	if (event.key === "Enter") {
		event.preventDefault(); // Apenas previne o comportamento padrão ao pressionar "Enter"
		sendMessage();
	}
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
