from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserDetail(models.Model):
    FullName=models.CharField(max_length=100)
    Email=models.EmailField(max_length=100,unique=True)
    MySalary=models.CharField(max_length=100,default=0)
    Password=models.CharField(max_length=50)
    RegDate=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.FullName

class Expense(models.Model):
    UserId=models.ForeignKey(UserDetail,on_delete=models.CASCADE)
    ExpenseDate=models.DateField(null=True,blank=True)
    ExpenseItem=models.CharField(max_length=100) 
    ExpenseCost=models.CharField(max_length=100)
    NoteDate=models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.ExpenseItem} - {self.ExpenseCost}" 
    

class MonthlySalary(models.Model):
    user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)
    month = models.DateField()   # Example: 2026-02-01

    salary = models.FloatField(default=0)
    expenses = models.FloatField(default=0)

    balance = models.FloatField(default=0)
    total_savings = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
     unique_together = ('user', 'month')

    def __str__(self):
        return f"{self.user} - {self.month}"