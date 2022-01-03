tempDir=$(mktemp -d)

git clone \
  --depth=1 \
  --filter=blob:none \
  --sparse \
  git@github.com:lessonnine/babbel.apigateway.git \
  $tempDir

(
cd $tempDir ;
git sparse-checkout init ;
git sparse-checkout set dist/swagger.yaml
)

npx openapi-typescript-codegen \
  --input "$tempDir/dist/swagger.yaml" \
  --output b4/@types/babbel.apigateway \
  --exportModels true \
  --exportCore false \
  --exportServices false \
  --useOptions
