export interface IlistUsers {
  loginId: number;
  login: string;
  loginName: string;
  email?: string;
  claimPermissions: {
      id: number;
      claimId: number;
      claimName: string;
      permissionId: number;
      permissionName: string;
    }[];
}
