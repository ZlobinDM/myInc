export interface YoutubeResponse {
  nextPageToken: string;
  items: [
    {
      id: string;
      snippet: {
        title: string;
        thumbnails: {
          standard: { url: string; },
          default: { url: string; },
        }
      };
    }
  ];
}
