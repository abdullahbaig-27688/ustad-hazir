
import type { FC } from "react";
// Props
interface inPutFieldsProp {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}
const inPutFields: FC<inPutFieldsProp> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
}) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default inPutFields;
