export interface Profile {
  username: string;
  email: string;
  emailVerified: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  status: 'active' | 'revoked';
}

export interface ActivityLog {
  id: string;
  type: string;
  timestamp: string;
  message: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}
