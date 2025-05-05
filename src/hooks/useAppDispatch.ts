import { useDispatch } from "react-redux";
import { AppDispatch } from "../Types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
