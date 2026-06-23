import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/graphql/schema/typeDefs.ts",
  generates: {
    "src/generated/resolvers.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../graphql/context#Context",
        useIndexSignature: true,
      },
    },
    "src/generated/": {
      documents: "./src/modules/**/*.{ts,tsx}",
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
};

export default config;
