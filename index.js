require('dotenv').config();
const Figma = require('figma-api');
const api = new Figma.Api({
  personalAccessToken: process.env.FIGMA_ACCESS_TOKEN,
});

const nodes = [];
const depthFirstSearch = ({ node }) => {
  if (node.children) {
    nodes.unshift(...node.children);

    node.children.map((node) =>
      depthFirstSearch({
        node,
      }),
    );
  }
};

const main = async () => {
  const { document } = await api.getFile(process.env.FIGMA_FILE_KEY);
  const visitor = {
    COMPONENT: (node) => {
      console.log(node.type, node.name);

      // if (node.name === 'ComponentB') {
      //   console.log(node);
      // }
    },
    INSTANCE: (node) => {
      console.log(node.type, node.name);
    },
    RECTANGLE: (node) => {
      console.log(node.fills);
    },
  };
  depthFirstSearch({ node: document });

  for (const node of nodes) {
    if (visitor[node.type]) {
      visitor[node.type](node);
    }
  }
};

main();
