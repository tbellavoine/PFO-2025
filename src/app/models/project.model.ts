export class Project {
  id: number;
  date: string;
  name: string;
  company: string;
  category: string;
  type: string;
  status: string;
  description: string;
  skills: string[] | undefined;
  links: ProjectLink[] | undefined;

  constructor(id: number, date: string, name: string, company: string, category: string, type: string, status: string, description: string, skills: string[] | undefined, links: ProjectLink[] | undefined) {
    this.id = id;
    this.date = date;
    this.category = category;
    this.name = name;
    this.company = company;
    this.type = type;
    this.status = status;
    this.description = description;
    this.skills = skills;
    this.links = links;
  }
}

export type ProjectLink = {
  label: string;
  url?: string;
  imgUrl?: string;
}
