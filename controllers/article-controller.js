const DUMMY_ARTICLES = [
  {
    id: "halkj13j0adf10",
    title: "The Best Time of Year to Travel to Japan",
    image: "/src/assets/images/",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum posuere lorem ipsum dolor sit. Vitae turpis massa sed elementum tempus egestas. Rutrum quisque non tellus orci ac auctor augue mauris. Ultrices mi tempus imperdiet nulla. Egestas diam in arcu cursus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Cursus mattis molestie a iaculis at erat. Enim lobortis scelerisque fermentum dui faucibus in ornare quam. Posuere morbi leo urna molestie at elementum eu.",
      "Suspendisse ultrices gravida dictum fusce. In mollis nunc sed id semper risus in. Sapien pellentesque habitant morbi tristique senectus et. Suspendisse interdum consectetur libero id faucibus nisl. Semper viverra nam libero justo. Sagittis nisl rhoncus mattis rhoncus. Nec ullamcorper sit amet risus nullam eget felis eget nunc. Dui ut ornare lectus sit. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Sit amet tellus cras adipiscing. Eget arcu dictum varius duis at consectetur lorem donec massa. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse. Eu turpis egestas pretium aenean pharetra. In eu mi bibendum neque egestas congue quisque egestas diam. Non blandit massa enim nec dui.",
      "Luctus venenatis lectus magna fringilla urna. Vitae justo eget magna fermentum iaculis eu. Diam donec adipiscing tristique risus. Accumsan in nisl nisi scelerisque. Condimentum vitae sapien pellentesque habitant morbi. Adipiscing elit ut aliquam purus. Vestibulum morbi blandit cursus risus. Commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae. Pretium viverra suspendisse potenti nullam ac tortor vitae purus. Et netus et malesuada fames ac turpis. Sed id semper risus in hendrerit gravida. Cursus eget nunc scelerisque viverra mauris in aliquam sem. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Sit amet dictum sit amet justo donec enim diam vulputate. Metus dictum at tempor commodo. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Tellus id interdum velit laoreet id donec ultrices. Diam vel quam elementum pulvinar etiam non quam lacus. Nisi vitae suscipit tellus mauris a diam maecenas sed. At tempor commodo ullamcorper a lacus.",
    ],
    createdAt: "Wednesday, 24 February 2021",
    author: {
      id: "alkjdf01daoafk",
      name: "John Mayor",
    },
  },
  {
    id: "halkj13j0sadf10",
    title: "Title 2",
    image: "/src/assets/images/",
    content: ["paragraph 1", "paragraph 2", "paragraph 3"],
    createdAt: "Wednesday, 24 February 2021",
    author: {
      id: "alkjdf01daoafk",
      name: "John Mayor",
    },
  },
  {
    id: "halkj13dj0adf10",
    title: "Title 3",
    image: "/src/assets/images/",
    content: ["3 paragraph 1", "3 paragraph 2", "3 paragraph 3"],
    createdAt: "Wednesday, 24 February 2021",
    author: {
      id: "alkjdf01daoaf",
      name: "John Mayor",
    },
  },
  {
    id: "halkj13sfj0adf10",
    title: "Title 3",
    image: "/src/assets/images/",
    content: ["3 paragraph 1", "3 paragraph 2", "3 paragraph 3"],
    createdAt: "Wednesday, 24 February 2021",
    author: {
      id: "alkjdf01daoaf",
      name: "John Mayor",
    },
  },
];

const getArticles = (req, res, next) => {
  res.json({ data: DUMMY_ARTICLES });
};

const getArticleByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const articles = DUMMY_ARTICLES.filter((article) => {
    return article.author.id === userId;
  });
  res.json({ data: articles });
};

const getArticleById = (req, res, next) => {
  const articleId = req.params.aid;
  console.log(articleId);
  const article = DUMMY_ARTICLES.find((article) => {
    return article.id === articleId;
  });
  res.json({ data: article });
};

exports.getArticles = getArticles;
exports.getArticleByUserId = getArticleByUserId;
exports.getArticleById = getArticleById;
