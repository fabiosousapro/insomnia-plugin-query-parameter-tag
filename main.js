const queryParameterTagOrTemp = {
  name: "queryParam",
  displayName: "Query Parameter or Temp Value",
  liveDisplayName(args) {
    const name = args[0].value;
    return name && name;
  },
  description: "reference parameter value from Query tab",
  args: [
    {
      displayName: "Query Parameter Name",
      description: "Name of the query parameter in Query tab",
      placeholder: "Choice query parameter available in Query tab",
      type: "string",
    },
    {
      displayName: 'Temp Value',
      description: 'If you need a temp value fill this in else it will default to query value',
      placeholder: "Default",
      type: "string",
    },
  ],
  async run(context, name, temp) {
    if (temp) {
      return context.util.render(temp)
    }
    if (!name) {
      name = "";
    }
    const { meta } = context;
    const request = await context.util.models.request.getById(meta.requestId);
    const parameterNames = [];
    if (request.parameters.length === 0) {
      throw new Error("No query parameters available");
    }

    for (const queryParameter of request.parameters) {
      const queryParameterName = await context.util.render(queryParameter.name);
      parameterNames.push(queryParameterName);
      if (queryParameterName.toLowerCase() === name.toLowerCase()) {
        return context.util.render(queryParameter.value);
      }
    }

    const parameterNamesStr = parameterNames.map((n) => `"${n}"`).join(",\n\t");
    throw new Error(
      `No query parameter with name "${name}".\nQuery parameter available:\n[\n\t${parameterNamesStr}\n]`
    );
  },
};

module.exports.templateTags = [queryParameterTagOrTemp];