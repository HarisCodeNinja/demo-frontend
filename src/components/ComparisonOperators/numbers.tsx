import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface NumbersComparisonProps {
  form: UseFormReturn<any>;
  fieldName: string;
}

const NumbersComparison: React.FC<NumbersComparisonProps> = ({ form, fieldName }) => {
  return (
    <Select
      onValueChange={(val) => {
        form.setValue(fieldName, val);
      }}
      defaultValue="GT">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="GT">Greater Than (&gt;)</SelectItem>
        <SelectItem value="GTE">Greater Than or Equal (&gt;=)</SelectItem>
        <SelectItem value="LT">Less Than (&lt;)</SelectItem>
        <SelectItem value="LTE">Less Than or Equal (&lt;=)</SelectItem>
        <SelectItem value="EQ">Equal (=)</SelectItem>
        <SelectItem value="NEQ">Not Equal (≠)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default NumbersComparison;
