export const compose = (...functionsToCompose) => (argumentsOfFunctions) => {
  return functionsToCompose.reduceRight((result, functionToCompose) => {
    return functionToCompose(result);
  }, argumentsOfFunctions);
};
