import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

function parseFrontmatter(fileContents: string, slug: string): BlogPost {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = frontmatterRegex.exec(fileContents);
  
  let title = slug;
  let date = '';
  let description = '';
  let content = fileContents;
  
  if (match) {
    const frontmatter = match[1];
    content = fileContents.replace(match[0], '');
    
    frontmatter.split('\n').forEach(line => {
      const splitIdx = line.indexOf(':');
      if (splitIdx > -1) {
        const key = line.slice(0, splitIdx).trim();
        const val = line.slice(splitIdx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
        
        if (key === 'title') title = val;
        if (key === 'date') date = val;
        if (key === 'description') description = val;
      }
    });
  }

  return {
    slug,
    title,
    date,
    description,
    content
  };
}

export function getSortedPostsData(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      return parseFrontmatter(fileContents, slug);
    });
  
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostData(slug: string): BlogPost | undefined {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return undefined;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return parseFrontmatter(fileContents, slug);
}
