export interface Group {
  groupName: string;
  groupId: number;
  createdOn: string;
  transcripts: { witnessName: string; id: number }[];
}
