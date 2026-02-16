from django.contrib import admin
from .models import UserDetail,Expense,MonthlySalary

# Register your models here.
admin.site.register(UserDetail)
admin.site.register(Expense)
admin.site.register(MonthlySalary)
