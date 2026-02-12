exports.handler = async (event) => {
  try {
    const { amount, method } = JSON.parse(event.body);

    if (!amount || amount < 1 || amount > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Valor inválido" })
      };
    }

    // Gera um ID único para evitar erro 400 por duplicidade
    const externalId = "DOACAO_" + Date.now();

    const response = await fetch("https://api.elitepaybr.com/api/v1/deposit", {
      method: "POST",
      headers: {
        "x-client-id": process.env.ELITEPAY_CLIENT_ID,
        "x-client-secret": process.env.ELITEPAY_CLIENT_SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Number(amount),
        description: "Doação para Dona Josefa",
        externalId: externalId,
        paymentMethod: method ? method.toUpperCase() : "PIX",
        payer: {
          name: "Doacao Site",
          document: "54978012856"
        }
      })
    });

    const data = await response.json();

    // Mostra erro real da API
    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: data.message || JSON.stringify(data)
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        transactionId: data.transactionId,
        copyPaste: data.pix?.copyPaste || data.copyPaste,
        checkoutUrl: data.checkoutUrl || null
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
