import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "./form-control";
import { View } from "react-native";

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />;
};

const FormItem = ({
  children,
  className,
  isInvalid,
}: {
  children: React.ReactNode;
  className?: string;
  isInvalid?: boolean;
}) => {
  return (
    <FormControl isInvalid={isInvalid} className={className}>
      <View className="gap-1">{children}</View>
    </FormControl>
  );
};

const FormLabel = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <FormControlLabel className={className}>
    <FormControlLabelText>{children}</FormControlLabelText>
  </FormControlLabel>
);

const FormMessage = ({ children }: { children?: string }) => {
  if (!children) return null;
  return (
    <FormControlError>
      <FormControlErrorText className="text-xl text-error">
        {children}
      </FormControlErrorText>
    </FormControlError>
  );
};

export { Form, FormField, FormItem, FormLabel, FormMessage };
