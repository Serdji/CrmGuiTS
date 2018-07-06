export interface IlistUsers {
  idLogin: number;
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
