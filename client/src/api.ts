import type { Experience, Project } from "./types/portfolio";

// Use environment variable VITE_API_BASE_URL, or fall back to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5087";

export async function fetchWorkExperiences(): Promise<Experience[]> {
  const response = await fetch(`${API_BASE_URL}/api/work-experiences`);

  if (!response.ok) {
    throw new Error("Failed to fetch work experiences");
  }

  return response.json();
}

export async function fetchTopWorkExperiences(): Promise<Experience[]> {
  const response = await fetch(`${API_BASE_URL}/api/top-work-experiences`);

  if (!response.ok) {
    throw new Error("Failed to fetch top work experiences");
  }

  return response.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function fetchTopProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/api/top-projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch top projects");
  }

  return response.json();
}

export async function fetchHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("API is unavailable");
  }

  return response.json();
}
