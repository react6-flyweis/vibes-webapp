import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type Permission = "Edit" | "View";

export type AddDesignCollaboratorPayload = {
  community_designs_id: number;
  design_tabs_map_id: number;
  email: string;
  permission: Permission;
};

export async function addDesignCollaborator(
  payload: AddDesignCollaboratorPayload
) {
  // runtime validation to ensure permission is either 'Edit' or 'View'
  const validPermissions: Permission[] = ["Edit", "View"];
  if (!validPermissions.includes(payload.permission)) {
    throw new Error(
      `Invalid permission \"${
        payload.permission
      }\". Must be one of: ${validPermissions.join(", ")}`
    );
  }

  const url = `/api/master/design-tabs-map/addCollaborator`;
  const res: AxiosResponse = await axiosInstance.post<IResponse<any>>(
    url,
    payload
  );
  return res.data;
}

export function useAddDesignCollaboratorMutation(options?: {
  onSuccess?: (data: IResponse<any>) => void;
  onError?: (err: any) => void;
}) {
  return useMutation({
    mutationFn: (payload: AddDesignCollaboratorPayload) =>
      addDesignCollaborator(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
