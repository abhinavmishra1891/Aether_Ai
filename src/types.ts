export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface GenerationOutput {
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
}

export interface GenerationRecord {
  id: string;
  userId: string;
  inputIdea: string;
  output: GenerationOutput;
  createdAt: any; // Firestore Timestamp or ISO string
}

export enum AuthState {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}
