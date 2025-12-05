"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calculator,
  Landmark,
  Percent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  principalAmount: z
    .string()
    .min(1, { message: "Vui lòng nhập số tiền." })
    .refine((val) => !isNaN(parseInt(val.replace(/,/g, ""), 10)), {
      message: "Số tiền không hợp lệ.",
    })
    .refine((val) => parseInt(val.replace(/,/g, ""), 10) > 0, {
      message: "Số tiền phải lớn hơn 0.",
    }),
  settlementPercentage: z
    .string()
    .min(1, { message: "Vui lòng nhập phần trăm." })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Phần trăm không hợp lệ.",
    })
    .refine((val) => parseFloat(val) > 0 && parseFloat(val) <= 100, {
        message: "Phần trăm phải từ 0 đến 100.",
    }),
});

type CalculationResult = {
  settlementAmount: number;
};

export function SettlementCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principalAmount: "",
      settlementPercentage: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const principalAmount = parseInt(values.principalAmount.replace(/,/g, ""));
    const settlementPercentage = parseFloat(values.settlementPercentage);

    const settlementAmount = Math.round(principalAmount * (settlementPercentage / 100));

    setResult({
      settlementAmount,
    });
    setAnimationKey((prev) => prev + 1);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatNumberInput = (value: string) => {
    const numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numberValue)) {
      return '';
    }
    return new Intl.NumberFormat('en-US').format(numberValue);
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="bg-card">
          <CardTitle className="font-headline text-3xl">
            Tính Tiền Tất Toán
          </CardTitle>
          <CardDescription className="text-base">
            Nhập số tiền gốc và phần trăm tất toán để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="principalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền gốc</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="ví dụ: 10,000,000"
                          className="pl-10"
                          inputMode="numeric"
                          onChange={(e) => {
                            const formattedValue = formatNumberInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settlementPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% Tất toán</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="ví dụ: 30"
                          className="pl-10"
                          inputMode="decimal"
                           onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg font-bold">
                <Calculator className="mr-2 h-5 w-5" />
                Tính toán
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <div key={animationKey} className="animate-in fade-in-0 slide-in-from-bottom-10 duration-500">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Chi Tiết Kết Quả
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Separator className="my-4" />
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                    Số tiền cần tất toán
                    </p>
                    <p className="font-headline text-4xl font-bold text-accent">
                    {formatCurrency(result.settlementAmount)}
                    </p>
                </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
