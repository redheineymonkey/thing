questions = open('questions.txt').read().split('\n')

print('[')
for q in questions:
    print(q, ',')
print(']')