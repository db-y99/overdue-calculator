"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calculator,
  CalendarDays,
  Coins,
  TrendingUp,
  Wallet,
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  dueAmount: z
    .string()
    .min(1, { message: "Vui lòng nhập số tiền." })
    .refine((val) => !isNaN(parseInt(val.replace(/,/g, ""), 10)), {
      message: "Số tiền không hợp lệ.",
    })
    .refine((val) => parseInt(val.replace(/,/g, ""), 10) > 0, {
      message: "Số tiền phải lớn hơn 0.",
    }),
  overdueDays: z
    .string()
    .min(1, { message: "Vui lòng nhập số ngày." })
    .refine((val) => /^\d+$/.test(val), {
      message: "Số ngày phải là một số nguyên.",
    })
    .refine((val) => parseInt(val, 10) > 0, {
      message: "Số ngày phải lớn hơn 0.",
    }),
});

type CalculationResult = {
  averageDailyAmount: number;
  overduePerDay: number;
  totalOverdue: number;
};

export function OverdueCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dueAmount: "",
      overdueDays: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dueAmount = parseInt(values.dueAmount.replace(/,/g, ""));
    const overdueDays = parseInt(values.overdueDays);

    const AVERAGE_RATE = 1.099 / 100;
    const OVERDUE_MULTIPLIER = 1.5;

    const averageDailyAmount = dueAmount * AVERAGE_RATE;
    const overduePerDay = averageDailyAmount * OVERDUE_MULTIPLIER;
    const totalOverdue = overduePerDay * overdueDays;

    setResult({
      averageDailyAmount: Math.round(averageDailyAmount),
      overduePerDay: Math.round(overduePerDay),
      totalOverdue: Math.round(totalOverdue),
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
    const numberValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numberValue)) {
      return "";
    }
    return new Intl.NumberFormat("en-US").format(numberValue);
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="bg-card">
          <CardTitle className="font-headline text-3xl">
            Tính Tiền Quá Hạn
          </CardTitle>
          <CardDescription className="text-base">
            Nhập số tiền và ngày quá hạn để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="dueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền đến hạn hàng tháng</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="ví dụ: 1,000,000"
                          className="pl-10"
                          inputMode="numeric"
                          onChange={(e) => {
                            const formattedValue = formatNumberInput(
                              e.target.value
                            );
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
                name="overdueDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số ngày quá hạn</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="ví dụ: 5"
                          className="pl-10"
                          inputMode="numeric"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
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
        <div
          key={animationKey}
          className="animate-in fade-in-0 slide-in-from-bottom-10 duration-500"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Chi Tiết Kết Quả
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span className="text-secondary-foreground">
                    Số tiền trung bình 1 ngày
                  </span>
                </div>
                <span className="font-medium text-secondary-foreground">
                  {formatCurrency(result.averageDailyAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-secondary-foreground">
                    Số tiền quá hạn 1 ngày
                  </span>
                </div>
                <span className="font-medium text-secondary-foreground">
                  {formatCurrency(result.overduePerDay)}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Số tiền quá hạn</p>
                <p className="font-headline text-4xl font-bold text-accent">
                  {formatCurrency(result.totalOverdue)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
