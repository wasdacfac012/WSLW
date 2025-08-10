#include<iostream>
using namespace std;
int A[505],B[505],C[505];
int plus(int x)
{
int flag=1;
for(int i=1;i<=x;i++)
{
C[i]=A[i]+B[i];
if(C[i]>=10)
{
    C[i+1]=C[i]/10;
    C[i]%=10;   
}
flag++;
}
return C[flag+1]!=0?flag+1:flag;
}
int main()
{
int cnt1=1,cnt2=1;
char c,d;
memset(A,0,sizeof(int));
memset(B,0,sizeof(int));
lable:c=getchar();
if(c!='\0')
{
    A[cnt1++]=c-'0';
    goto lable;
}
lable:d=getchar();
if(d!='\0')
{
    B[cnt1++]=d-'0';
    goto lable;
}

for(int i=plus(cnt1>cnt2?cnt1:cnt2)i>=1;i--)cout<<C[i];
return 0;
}