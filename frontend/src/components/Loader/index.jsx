import { ClipLoader } from "react-spinners";
import "./index.css";

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <ClipLoader color="#888" size={50} />
    </div>
  );
}
