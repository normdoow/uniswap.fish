import { ModalContextState } from "./modalContext";

export enum ModalActionType {
  SET_SELECT_PAIR_MODAL_STATE = "SET_SELECT_PAIR_MODAL_STATE",
  SET_DONATE_MODAL_STATE = "SET_DONATE_MODAL_STATE",
  SET_ANNOUCEMENT_MODAL_STATE = "SET_ANNOUCEMENT_MODAL_STATE",
  SET_IMPERMANENT_LOSS_MODAL_STATE = "SET_IMPERMANENT_LOSS_MODAL_STATE",
  SET_CREATE_POSITION_MODAL_STATE = "SET_CREATE_POSITION_MODAL_STATE",
}

export type ModalContextAction =
  | { type: ModalActionType.SET_SELECT_PAIR_MODAL_STATE; payload: boolean }
  | { type: ModalActionType.SET_DONATE_MODAL_STATE; payload: boolean }
  | { type: ModalActionType.SET_ANNOUCEMENT_MODAL_STATE; payload: boolean }
  | {
      type: ModalActionType.SET_IMPERMANENT_LOSS_MODAL_STATE;
      payload: boolean;
    }
  | { type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE; payload: boolean };

export const modalContextReducer = (
  state: ModalContextState,
  action: ModalContextAction
): ModalContextState => {
  switch (action.type) {
    case ModalActionType.SET_ANNOUCEMENT_MODAL_STATE: {
      return { ...state, isImportantMessageModalOpen: action.payload };
    }
    case ModalActionType.SET_SELECT_PAIR_MODAL_STATE: {
      return { ...state, isSelectPairModalOpen: action.payload };
    }
    case ModalActionType.SET_DONATE_MODAL_STATE: {
      return { ...state, isDonateModalOpen: action.payload };
    }
    case ModalActionType.SET_IMPERMANENT_LOSS_MODAL_STATE: {
      return { ...state, isImpermanentLossModalOpen: action.payload };
    }
    case ModalActionType.SET_CREATE_POSITION_MODAL_STATE: {
      return { ...state, isCreatePositionModalOpen: action.payload };
    }
  }
};
