const apiKeyInput = document.getElementById('Key');
const gameSelect = document.getElementById('game');
const questionInput = document.getElementById('question');
const button = document.getElementById('button')
const ia = document.getElementById('ia')
const form = document.querySelector('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter ()
    return converter.makeHtml(text)
}

const peguntarIA = async (question, game, Key) => {
    const model = "gemini-2.5-flash"
    // AIzaSyA3DZ7QI90EWI_NMdw_fHiqFra1s3LH2Kk
    const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${Key}`
    const pergunta =`
    ## Especialidade
    Você é especialista assistente de meta para o jogo ${game}

    ##Tarefa
    Você deve responder as perguntas do usuario com base no seu conhecimento do jogo
    estrategias é bilds.

    ##Regras
    -Se você nao sabe a resposta responda 'nao sei' e nao tente inventar uma resposta.
    -Se a pergunta n esta relacionada com o jogo responda com 'essa pergunta nao esta relacionada com o jogo'.
    -considere a data  atual ${new Date().toLocaleDateString()}.
    -faça pesquisas atualizadas sobre o patch atual, baseado na data atua, para dar resposta coerente.
   - nunca responda itens que vc nao tenha certeza que existe no patch atual.
   - sempre pesquise os nomes corretos em qualquer idoma.
   
    ##Resposta
    Economize na resposta, seja direto e responda no maxio 500 caractere. Responda em markdown.
    nao precisa fazer nehnuma saldaçao ou despedida apenas responda o usuario.
    MAXIMO 500 CARACTERES


    ##Exemplo de resposta
    Pergunta do usuario: qual bild do kenji.
    Resposta: poder estrela \n\n **poder estrela**\n\n ** acessorios** \n\n\ ** engrenagem**

    ---

    Aqui esta a pergunta do usuario: ${question}

    `
    const contents =[{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

        const response = await fetch(baseURL ,{ 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
        })

        const data = await response.json()
        return data.candidates[0].content.parts[0].text
}
const EnviarForm = async (event) => {
    event.preventDefault()
    const Key = apiKeyInput.value
    const question = questionInput.value
    const game = gameSelect.value

    if(Key == '' || game == '' || question == '') {
        alert('Preencha todos os campos')
        return
    }
    button.disabled = true
    button.textContent ='Perguntando...'
    button.classList.add('loading')

    try{
       const text = await peguntarIA  ( question, game, Key)
       ia.querySelector('.resposta').innerHTML = markdownToHTML(text)
        


    }  catch (error) {
        console.log('Erro:', error)

    } finally{
        button.disabled = false
        button.textContent ='Perguntar'
        button.classList.remove('loading')
    }

}
form.addEventListener('submit', EnviarForm)
