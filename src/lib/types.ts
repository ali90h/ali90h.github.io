export type Mode = 'nothing' | 'object' | 'no-one';

export type WorkItem = {
  repo: string;
  oneLine: string;
  type: string;
  language: string;
  lastUpdate: string;
};

// This is a more accurate representation based on the TS error and API reality.
// It is not fully exhaustive but covers all fields used by the app and fixes the type error.
export type LogItem = {
  id: string;
  type: 'PullRequestEvent' | 'IssuesEvent' | string; // Allow string for future event types
  actor: {
      login: string;
      avatar_url: string;
      [key: string]: any; // Allow other properties
  };
  repo: {
    name: string;
    url: string;
    [key: string]: any; // Allow other properties
  };
  payload: {
    action: string;
    issue?: {
      html_url: string;
      title: string;
      [key: string]: any;
    };
    pull_request?: {
      html_url: string;
      title: string;
      merged: boolean;
      [key:string]: any;
    };
    [key: string]: any;
  };
  created_at: string;
  public: boolean;
  [key: string]: any;
};

export type GithubData = {
  work: WorkItem[];
  log: LogItem[];
  updatedAt: string;
};
