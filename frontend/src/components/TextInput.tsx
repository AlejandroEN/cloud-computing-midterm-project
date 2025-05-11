import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

interface NameInputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  text: string;
}

export default function TextInput<T extends FieldValues>(
  props: NameInputProps<T>,
) {
  return (
    <FormItem>
      <FormLabel>{props.text}</FormLabel>

      <FormControl>
        <Input {...props.field} {...props} />
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
