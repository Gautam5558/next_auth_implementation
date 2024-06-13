import { IoCheckmarkDoneCircle } from "react-icons/io5";

const FormSuccess = ({ message }: { message?: string }) => {
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <IoCheckmarkDoneCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
