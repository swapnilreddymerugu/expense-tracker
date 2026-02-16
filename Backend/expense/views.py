from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.db.models import Sum


# ---------------- SIGNUP ----------------
@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        fullname = data.get("FullName")
        email = data.get("Email")
        password = data.get("Password")
        salary = data.get("MySalary")

        if UserDetail.objects.filter(Email=email).exists():
            return JsonResponse({"message": "Email already exists"}, status=400)

        UserDetail.objects.create(
            FullName=fullname,
            Email=email,
            Password=password,
            MySalary=salary
        )

        return JsonResponse({"message": "User registered Successfully"}, status=201)

    return JsonResponse({"message": "Use POST method for Signup"}, status=405)


# ---------------- LOGIN ----------------
@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("Email")
        password = data.get("Password")

        try:
            user = UserDetail.objects.get(Email=email, Password=password)

            return JsonResponse({
                "message": "Login Successful!",
                "userId": user.id,
                "userName": user.FullName
            }, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({"message": "Invalid credentials"}, status=400)

    return JsonResponse({"message": "Use POST method for Login"}, status=405)


# ---------------- ADD EXPENSE ----------------
@csrf_exempt
def add_expense(request):
    if request.method == "POST":
        data = json.loads(request.body)

        userId = data.get("UserId")
        expenseDate = data.get("ExpenseDate")
        expenseItem = data.get("ExpenseItem")
        expenseCost = data.get("ExpenseCost")

        try:
            user = UserDetail.objects.get(id=userId)

            Expense.objects.create(
                UserId=user,
                ExpenseDate=expenseDate,
                ExpenseItem=expenseItem,
                ExpenseCost=expenseCost
            )

            return JsonResponse({"message": "Expense added successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "Error": str(e)}, status=400)

    return JsonResponse({"message": "Use POST method to Add Expense"}, status=405)


# ---------------- MANAGE EXPENSE ----------------
@csrf_exempt
def manage_expense(request, user_id):
    if request.method == "GET":
        expenses = Expense.objects.filter(UserId=user_id)
        expense_list = list(expenses.values())
        return JsonResponse(expense_list, safe=False)

    return JsonResponse({"message": "Only GET allowed"}, status=405)


# ---------------- UPDATE EXPENSE ----------------
@csrf_exempt
def update_expense(request, expense_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            expense = Expense.objects.get(id=expense_id)

            expense.ExpenseDate = data.get("ExpenseDate", expense.ExpenseDate)
            expense.ExpenseItem = data.get("ExpenseItem", expense.ExpenseItem)
            expense.ExpenseCost = data.get("ExpenseCost", expense.ExpenseCost)

            expense.save()

            return JsonResponse({"message": "Expense updated successfully!"}, status=200)

        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "Error": str(e)}, status=400)

    return JsonResponse({"message": "Only PUT allowed"}, status=405)


# ---------------- DELETE EXPENSE ----------------
@csrf_exempt
def delete_expense(request, expense_id):
    if request.method == "DELETE":
        try:
            expense = Expense.objects.get(id=expense_id)
            expense.delete()
            return JsonResponse({"message": "Expense deleted successfully!"}, status=200)

        except Expense.DoesNotExist:
            return JsonResponse({"message": "Expense not found"}, status=404)

    return JsonResponse({"message": "Only DELETE allowed"}, status=405)


# ---------------- SEARCH EXPENSE ----------------
@csrf_exempt
def search_expense(request, user_id):
    if request.method == "GET":
        from_date = request.GET.get("from")
        to_date = request.GET.get("to")

        expenses = Expense.objects.filter(
            UserId=user_id,
            ExpenseDate__range=[from_date, to_date]
        )

        expense_list = list(expenses.values())
        total = expenses.aggregate(Sum("ExpenseCost"))["ExpenseCost__sum"] or 0

        return JsonResponse({"expenses": expense_list, "grandTotal": total})

    return JsonResponse({"message": "Only GET allowed"}, status=405)


# ---------------- CHANGE PASSWORD ----------------
@csrf_exempt
def change_password(request, user_id):
    if request.method == "POST":
        data = json.loads(request.body)

        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        try:
            user = UserDetail.objects.get(id=user_id)

            if user.Password != current_password:
                return JsonResponse({"message": "Current password is incorrect"}, status=400)

            user.Password = new_password
            user.save()

            return JsonResponse({"message": "Password changed successfully!"}, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)

    return JsonResponse({"message": "Only POST allowed"}, status=405)


# ---------------- SALARY ----------------
@csrf_exempt
def salary(request, user_id):
    if request.method == "GET":
        try:
            user = UserDetail.objects.get(id=user_id)
            return JsonResponse({"salary": user.MySalary})

        except UserDetail.DoesNotExist:
            return JsonResponse({"salary": 0})

    return JsonResponse({"message": "Only GET allowed"}, status=405)


# ---------------- UPDATE SALARY ----------------
@csrf_exempt
def update_salary(request, user_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            user = UserDetail.objects.get(id=user_id)
            user.MySalary = data.get("salary")
            user.save()

            return JsonResponse({"message": "Salary updated successfully!"}, status=200)

        except Exception as e:
            return JsonResponse({"message": "Something went wrong", "Error": str(e)}, status=400)

    return JsonResponse({"message": "Only PUT allowed"}, status=405)


# ---------------- SAVINGS ----------------
@csrf_exempt
def savings(request, user_id):
    if request.method == "POST":
        data = json.loads(request.body)

        salary = float(data.get("salary"))
        user = UserDetail.objects.get(id=user_id)

        today = date.today()
        month_start = date(today.year, today.month, 1)

        expenses = Expense.objects.filter(
            UserId=user,
            ExpenseDate__year=today.year,
            ExpenseDate__month=today.month
        )

        total_expenses = sum(float(e.ExpenseCost) for e in expenses)

        balance = salary - total_expenses

        last_record = MonthlySalary.objects.filter(user=user).exclude(
            month=month_start
        ).order_by("-month").first()

        previous_savings = last_record.total_savings if last_record else 0
        new_total_savings = max(previous_savings + balance, 0)

        MonthlySalary.objects.update_or_create(
            user=user,
            month=month_start,
            defaults={
                "salary": salary,
                "expenses": total_expenses,
                "balance": balance,
                "total_savings": new_total_savings
            }
        )

        return JsonResponse({
            "message": "Monthly Salary Updated Successfully",
            "balance": balance,
            "total_savings": new_total_savings
        })

    return JsonResponse({"message": "Only POST allowed"}, status=405)
