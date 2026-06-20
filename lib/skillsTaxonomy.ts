export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillsTaxonomy: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Go",
      "Rust",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "SQL",
      "HTML",
      "CSS",
      "Shell",
      "Bash",
      "Scala",
      "R",
      "MATLAB",
      "Perl",
      "Dart",
      "Haskell",
      "Objective-C"
    ]
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "Svelte",
      "Nuxt.js",
      "NestJS",
      "Express.js",
      "Koa",
      "Fastify",
      "Django",
      "Flask",
      "FastAPI",
      "Spring Boot",
      "ASP.NET",
      "Laravel",
      "Ruby on Rails",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Redux",
      "Zustand",
      "Recoil",
      "TanStack Query",
      "Prisma",
      "TypeORM",
      "Mongoose",
      "Hibernate",
      "jQuery",
      "NextJS",
      "Vue",
      "Express"
    ]
  },
  {
    name: "Databases",
    skills: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "Cassandra",
      "DynamoDB",
      "MariaDB",
      "Firebase",
      "Firestore",
      "Neo4j",
      "Oracle",
      "MS SQL Server",
      "CouchDB",
      "Supabase"
    ]
  },
  {
    name: "Cloud & DevOps",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "GCP",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Jenkins",
      "GitHub Actions",
      "GitLab CI",
      "CircleCI",
      "Vercel",
      "Netlify",
      "Heroku",
      "Nginx",
      "Apache",
      "CI/CD",
      "Serverless",
      "Cloudflare",
      "Kubectl",
      "Prometheus",
      "Grafana",
      "Docker Compose"
    ]
  },
  {
    name: "AI, ML & Data Science",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "Natural Language Processing",
      "NLP",
      "Computer Vision",
      "Generative AI",
      "LLMs",
      "Large Language Models",
      "Prompt Engineering",
      "LangChain",
      "LlamaIndex",
      "Vector Databases",
      "Pinecone",
      "Milvus",
      "ChromaDB",
      "Data Science",
      "Data Analytics",
      "Apache Spark",
      "Hadoop",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "SciPy",
      "Jupyter",
      "RLHF"
    ]
  },
  {
    name: "Tools & Methodologies",
    skills: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Jira",
      "Confluence",
      "Trello",
      "Asana",
      "Figma",
      "Adobe XD",
      "Photoshop",
      "Postman",
      "Swagger",
      "Insomnia",
      "Agile",
      "Scrum",
      "Kanban",
      "Webpack",
      "Vite",
      "Rollup",
      "Babel",
      "ESLint",
      "Prettier",
      "npm",
      "yarn",
      "pnpm",
      "Unit Testing",
      "Integration Testing",
      "Jest",
      "Cypress",
      "Playwright",
      "Vitest",
      "Linux"
    ]
  },
  {
    name: "Soft Skills & Management",
    skills: [
      "Communication",
      "Leadership",
      "Collaboration",
      "Teamwork",
      "Problem Solving",
      "Critical Thinking",
      "Time Management",
      "Adaptability",
      "Public Speaking",
      "Mentoring",
      "Emotional Intelligence",
      "Conflict Resolution",
      "Negotiation",
      "Project Management",
      "Product Management",
      "Customer Success"
    ]
  }
];

// Flat list of lowercase skill names for easy lookup
export const flatSkillsList = skillsTaxonomy.flatMap(cat => 
  cat.skills.map(skill => skill.toLowerCase())
);

// Map of lowercase skill names to their original display names
export const skillDisplayMap: Record<string, string> = {};
skillsTaxonomy.forEach(cat => {
  cat.skills.forEach(skill => {
    skillDisplayMap[skill.toLowerCase()] = skill;
  });
});
