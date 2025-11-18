import numpy as np
# print(np.__version__)
 
# a1=[1,2,3,4]
# print(type(a1))
# a=np.array([1,2,3,4])
# print(type(a))
# b=np.array([[1,2,3],[4,5,6]])
# print(a)
# print(b)
# print(np.zeros((2,3)))
# print(type(np.zeros((2,3))))
# print(np.ones((2,3)))
# print(np.full((2,3),7))
# print(np.eye(3))
# print (np.arange(0.10,2))
# print(np.linspace(0,1,5))

# print(np.random.rand(2,3))
# print(np.random.randn(2,3))
# print(np.random.randint(0,10,(2,3)))
# arr=np.array([[1,2,3],[4,5,6]])
# print(arr.shape)
# print(arr.ndim)
# print(arr.size)
# print(arr.dtype)
# print(arr.itemsize)
# arr=np.array([[10,20,30,40,50,60]])
# print(arr[1])
# print(arr[2:4])
# print(arr[-2])
# print(arr[::2])
# arr=np.array([[10,20,30],[40,50,60]])
# print(arr[0,1])
# print(arr[:,1])
# print(arr[1,:])
# print(arr[0:2,1])
# arr2 = np.arange(1, 20, 2)
# selection = arr2[[4, 6]] 
# print(selection)  
# print(arr2[::-1])


# arr = np.arange(10)  
# arr[2:5] = 99       
# print(arr)
# a=np.array([[1,2],[3,4]])
# b=np.array([[5,6],[7,8]])
# print(a.dot(b))
# print(np.dot(a,b))
# arr=np.array([[10,20,30,40,50]])
# print(arr.sum())
# print(arr.mean())
# print(arr.std())
# print(arr.var())
# print(arr.min())
# print(arr.max())
# print(np.median(arr))
# arr=np.arange(1,13)
# print(arr)
# arr2=arr.reshape(3,4)
# print(arr2)

# flat=arr2.flatten()
# print(flat)
# a = np.array([[1,2],[3,4]])
# b=np.array([[5,6],[7,8]])
# print(np.vstack((a,b)))
# print(np.hstack((a,b)))
# arr=np.arange(10)
# print(np.split(arr,2))
# arr=np.array([[10,20,30,40,50]])
# print(arr[arr>30])
# arr[arr>30]=0
# print(arr)
# print(np.unique([1,2,2,3,]))
# print(np.sort([3,0,2,1]))
# print(np.argsort([3,0,2,1]))
# print(np.argmax([3,0,2,1]))
# print(np.argmin([3,0,2,1]))
# A=np.array([[1,2,],[3,4]])
# print(np.linalg.det(A))
# print(np.linalg.inv(A))
# print(np.linalg.eig(A))
np.random.seed(42)
print(np.random.randn(3))
print(np.random.randint(0,10,3))
print(np.random.choice([10, 20, 30], size=5))