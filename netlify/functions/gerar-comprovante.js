exports.handler = async (event) => {

  const valor = event.queryStringParameters.valor;
  const dataAtual = new Date().toLocaleString("pt-BR");

  const conteudo = `
COMPROVANTE DE DOAÇÃO

Instituto Solidariedade

Valor: R$ ${valor}
Data: ${dataAtual}

Agradecemos sua contribuição!
`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=comprovante.pdf"
    },
    body: Buffer.from(conteudo).toString("base64"),
    isBase64Encoded: true
  };
};
