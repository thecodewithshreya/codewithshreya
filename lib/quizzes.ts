import type { QuizQuestion } from "@/lib/quiz-format";

export type StaticQuiz = {
  slug: string;
  title: string;
  topic: string;
  level: string;
  tags: string[];
  items: QuizQuestion[];
};

export const staticQuizzes: StaticQuiz[] = [
  {
    slug: "data-structures-fundamentals",
    title: "Data Structures Fundamentals",
    topic: "Arrays / Stack / Queue",
    level: "Beginner",
    tags: ["Arrays", "Stack", "Queue"],
    items: [
      {
        question: "What is the time complexity of accessing the element at index i in an array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Array elements are stored contiguously, so the address is base + i × size, computed in constant time.",
      },
      {
        question: "Which data structure follows Last In, First Out (LIFO) order?",
        options: ["Queue", "Stack", "Deque used as a queue", "Priority queue"],
        answer: 1,
        explanation: "A stack pops the most recently pushed element first.",
      },
      {
        question: "The sequence push(1), push(2), pop(), push(3), pop(), pop() is run on an empty stack. In what order are values popped?",
        options: ["1, 2, 3", "2, 3, 1", "3, 2, 1", "2, 1, 3"],
        answer: 1,
        explanation: "pop() removes 2, then 3 is pushed and popped, and finally 1 is popped.",
      },
      {
        question: "In a circular queue implemented with an array of size n, which condition is commonly used to detect that the queue is full (one slot kept empty)?",
        options: ["front == rear", "(rear + 1) % n == front", "rear == n - 1", "front == 0"],
        answer: 1,
        explanation: "Leaving one slot empty lets front == rear mean empty and (rear + 1) % n == front mean full.",
      },
      {
        question: "What is the worst-case time to insert an element at the beginning of an array of n elements?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        explanation: "Every existing element must shift one position to the right.",
      },
      {
        question: "Which data structure is best suited to check whether the brackets in an expression are balanced?",
        options: ["Queue", "Stack", "Binary search tree", "Hash table"],
        answer: 1,
        explanation: "Push each opening bracket and pop when a closing bracket appears; the most recent opening bracket must match.",
      },
      {
        question: "Breadth-first traversal of a tree or graph typically uses which data structure?",
        options: ["Stack", "Queue", "Heap", "Array sorted by value"],
        answer: 1,
        explanation: "BFS visits nodes level by level, which matches FIFO order.",
      },
      {
        question: "What is the postfix form of the infix expression A + B * C?",
        options: ["A B + C *", "A B C * +", "A B C + *", "+ A * B C"],
        answer: 1,
        explanation: "Multiplication binds tighter, so B C * is computed first and then added to A.",
      },
      {
        question: "With a singly linked list that keeps only a head pointer, what is the cost of deleting the last node?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        explanation: "You must walk to the second-last node to update its next pointer.",
      },
      {
        question: "How many stacks are needed, at minimum, to implement a queue?",
        options: ["1", "2", "3", "A queue cannot be built from stacks"],
        answer: 1,
        explanation: "One stack receives enqueued items; when the other is empty, items are moved over, reversing their order for dequeue.",
      },
    ],
  },
  {
    slug: "graph-algorithms",
    title: "Graph Algorithms",
    topic: "BFS / DFS / Dijkstra",
    level: "Advanced",
    tags: ["BFS", "DFS", "Dijkstra"],
    items: [
      {
        question: "What is the time complexity of BFS on a graph with V vertices and E edges stored as an adjacency list?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
        answer: 2,
        explanation: "Each vertex is enqueued once and each adjacency list is scanned once.",
      },
      {
        question: "In an unweighted graph, which algorithm finds the shortest path (fewest edges) from a source?",
        options: ["DFS", "BFS", "Prim's algorithm", "Topological sort"],
        answer: 1,
        explanation: "BFS discovers vertices in increasing order of edge distance from the source.",
      },
      {
        question: "Dijkstra's algorithm may give wrong answers when the graph contains:",
        options: ["Cycles", "Negative edge weights", "Parallel edges", "More than 1000 vertices"],
        answer: 1,
        explanation: "Dijkstra finalizes a vertex once it is extracted; a later negative edge could have produced a shorter path.",
      },
      {
        question: "Which algorithm can detect a negative-weight cycle reachable from the source?",
        options: ["Dijkstra", "Bellman-Ford", "BFS", "Kruskal"],
        answer: 1,
        explanation: "If any edge can still be relaxed after V − 1 rounds, a negative cycle is reachable.",
      },
      {
        question: "During DFS of a directed graph, finding a back edge means the graph:",
        options: ["Is a tree", "Contains a cycle", "Is bipartite", "Is disconnected"],
        answer: 1,
        explanation: "A back edge points to an ancestor still on the recursion stack, which closes a cycle.",
      },
      {
        question: "A topological ordering exists if and only if the directed graph is:",
        options: ["Strongly connected", "Acyclic", "Complete", "Weighted"],
        answer: 1,
        explanation: "Any cycle would require a vertex to come before itself.",
      },
      {
        question: "Using a binary heap, what is the time complexity of Dijkstra's algorithm?",
        options: ["O(V²)", "O((V + E) log V)", "O(V + E)", "O(E × V)"],
        answer: 1,
        explanation: "Each extract-min and each decrease-key costs O(log V).",
      },
      {
        question: "Which algorithm computes shortest paths between all pairs of vertices in O(V³) time?",
        options: ["Floyd-Warshall", "Prim", "Kruskal", "Bellman-Ford"],
        answer: 0,
        explanation: "Floyd-Warshall tries every vertex as an intermediate for every pair.",
      },
      {
        question: "Kruskal's algorithm builds a minimum spanning tree by:",
        options: [
          "Growing one tree from a start vertex",
          "Adding the cheapest edge that does not form a cycle",
          "Removing the most expensive edge repeatedly",
          "Running BFS from every vertex",
        ],
        answer: 1,
        explanation: "Edges are taken in increasing weight order, and a union-find structure rejects edges that would form a cycle.",
      },
      {
        question: "What is the maximum number of edges in a simple undirected graph with n vertices?",
        options: ["n − 1", "n", "n(n − 1)/2", "n²"],
        answer: 2,
        explanation: "Each pair of distinct vertices can be joined by at most one edge.",
      },
    ],
  },
  {
    slug: "operating-systems-basics",
    title: "Operating Systems Basics",
    topic: "Processes / Memory / Scheduling",
    level: "Beginner",
    tags: ["Processes", "Memory", "Scheduling"],
    items: [
      {
        question: "Which scheduling algorithm can cause starvation of long processes?",
        options: ["First-Come First-Served", "Round Robin", "Shortest Job First", "None of these"],
        answer: 2,
        explanation: "If short jobs keep arriving, a long job may never be chosen.",
      },
      {
        question: "Which statement about threads of the same process is true?",
        options: [
          "They have separate address spaces",
          "They share the address space but each has its own stack",
          "They cannot run concurrently",
          "They each have their own open-file table",
        ],
        answer: 1,
        explanation: "Threads share code, data, heap and open files, but each keeps its own registers and stack.",
      },
      {
        question: "A program calls fork() three times in sequence. How many processes exist in total, including the original?",
        options: ["3", "4", "6", "8"],
        answer: 3,
        explanation: "Each fork doubles the number of processes: 2³ = 8.",
      },
      {
        question: "Which of these is NOT one of the four necessary conditions for deadlock?",
        options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
        answer: 2,
        explanation: "The condition is no preemption; allowing preemption breaks deadlock.",
      },
      {
        question: "In paging, the logical address is split into:",
        options: [
          "Segment number and offset",
          "Page number and offset",
          "Frame number and segment",
          "Base and limit",
        ],
        answer: 1,
        explanation: "The page number indexes the page table to find a frame; the offset is kept as is.",
      },
      {
        question: "Belady's anomaly, where more frames can cause more page faults, can occur with:",
        options: ["LRU", "Optimal", "FIFO", "All stack-based algorithms"],
        answer: 2,
        explanation: "FIFO is not a stack algorithm, so adding frames does not guarantee fewer faults.",
      },
      {
        question: "Thrashing happens when:",
        options: [
          "The CPU is idle because no process is ready",
          "Processes spend more time paging than executing",
          "Two processes wait on each other forever",
          "The disk scheduler reorders requests",
        ],
        answer: 1,
        explanation: "When working sets do not fit in memory, page faults dominate and useful work collapses.",
      },
      {
        question: "Which mechanism lets a user program request a service from the kernel?",
        options: ["Interrupt vector table", "System call", "Context switch", "Page table"],
        answer: 1,
        explanation: "A system call switches the CPU into kernel mode to perform the requested service.",
      },
      {
        question: "A binary semaphore is mainly used to provide:",
        options: ["Mutual exclusion", "Virtual memory", "Process creation", "Disk scheduling"],
        answer: 0,
        explanation: "With values 0 and 1 it acts as a lock around a critical section.",
      },
      {
        question: "In Round Robin scheduling, a very large time quantum makes the algorithm behave like:",
        options: ["Shortest Job First", "First-Come First-Served", "Priority scheduling", "Multilevel queue"],
        answer: 1,
        explanation: "If every process finishes within one quantum, no preemption happens and the order is arrival order.",
      },
    ],
  },
  {
    slug: "dbms-essentials",
    title: "DBMS Essentials",
    topic: "SQL / Normalization / Transactions",
    level: "Intermediate",
    tags: ["SQL", "Normalization", "Transactions"],
    items: [
      {
        question: "Which SQL join returns all rows from the left table, with NULLs where there is no match on the right?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
        answer: 1,
        explanation: "LEFT JOIN preserves every left row and fills missing right columns with NULL.",
      },
      {
        question: "Which clause filters groups after aggregation?",
        options: ["WHERE", "HAVING", "ORDER BY", "GROUP BY"],
        answer: 1,
        explanation: "WHERE filters rows before grouping; HAVING filters the grouped results.",
      },
      {
        question: "A relation is in 2NF if it is in 1NF and:",
        options: [
          "It has no transitive dependencies",
          "No non-prime attribute depends on part of a candidate key",
          "Every determinant is a candidate key",
          "It has no multivalued dependencies",
        ],
        answer: 1,
        explanation: "2NF removes partial dependencies on a composite candidate key.",
      },
      {
        question: "In BCNF, for every non-trivial functional dependency X → Y:",
        options: ["Y is a prime attribute", "X is a superkey", "X is a single attribute", "Y is part of the primary key"],
        answer: 1,
        explanation: "BCNF requires every determinant to be a superkey.",
      },
      {
        question: "Which ACID property ensures that a committed transaction survives a system crash?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        answer: 3,
        explanation: "Durability means committed changes are persisted, usually via a write-ahead log.",
      },
      {
        question: "A dirty read happens when a transaction:",
        options: [
          "Reads data written by another transaction that has not committed",
          "Reads the same row twice and gets different values",
          "Sees new rows appear in a repeated range query",
          "Overwrites a value without reading it",
        ],
        answer: 0,
        explanation: "If the writer later rolls back, the reader used data that never officially existed.",
      },
      {
        question: "Table A has 4 rows and table B has 5 rows. How many rows does A CROSS JOIN B return?",
        options: ["9", "5", "20", "4"],
        answer: 2,
        explanation: "A cross join pairs every row of A with every row of B: 4 × 5 = 20.",
      },
      {
        question: "Given R(A, B, C) with A → B and B → C, what is the closure of {A}?",
        options: ["{A}", "{A, B}", "{A, B, C}", "{B, C}"],
        answer: 2,
        explanation: "A gives B, and B gives C, so A⁺ = {A, B, C}.",
      },
      {
        question: "Two-phase locking (2PL) guarantees:",
        options: ["Freedom from deadlock", "Conflict serializability", "No cascading rollbacks", "Faster commits"],
        answer: 1,
        explanation: "Basic 2PL ensures conflict serializability but can still deadlock.",
      },
      {
        question: "Which constraint ensures a column value matches a value in another table's primary key?",
        options: ["UNIQUE", "CHECK", "FOREIGN KEY", "NOT NULL"],
        answer: 2,
        explanation: "A foreign key enforces referential integrity between the two tables.",
      },
    ],
  },
  {
    slug: "computer-networks-basics",
    title: "Computer Networks Basics",
    topic: "TCP / IP / DNS",
    level: "Beginner",
    tags: ["TCP", "IP", "DNS"],
    items: [
      {
        question: "How many messages does the TCP three-way handshake use to open a connection?",
        options: ["2", "3", "4", "1"],
        answer: 1,
        explanation: "SYN, SYN-ACK, then ACK.",
      },
      {
        question: "Which transport protocol is connectionless and does not guarantee delivery?",
        options: ["TCP", "UDP", "SCTP", "HTTP"],
        answer: 1,
        explanation: "UDP sends independent datagrams with no handshake, retransmission or ordering.",
      },
      {
        question: "DNS translates:",
        options: ["MAC addresses to IP addresses", "Domain names to IP addresses", "IP addresses to port numbers", "URLs to HTML"],
        answer: 1,
        explanation: "DNS resolves human-readable names like example.com to IP addresses.",
      },
      {
        question: "How many usable host addresses does a /26 IPv4 subnet provide?",
        options: ["64", "62", "30", "126"],
        answer: 1,
        explanation: "A /26 has 2⁶ = 64 addresses; the network and broadcast addresses leave 62 usable.",
      },
      {
        question: "Which protocol maps an IPv4 address to a MAC address on a local network?",
        options: ["DNS", "DHCP", "ARP", "ICMP"],
        answer: 2,
        explanation: "ARP broadcasts a request asking which device owns a given IP address.",
      },
      {
        question: "At which layer of the OSI model do routers primarily operate?",
        options: ["Physical", "Data link", "Network", "Transport"],
        answer: 2,
        explanation: "Routers forward packets using network-layer (IP) addresses.",
      },
      {
        question: "What is the default port for HTTPS?",
        options: ["80", "443", "21", "8080"],
        answer: 1,
        explanation: "HTTP uses 80 by default and HTTPS uses 443.",
      },
      {
        question: "Which of these is a private IPv4 address?",
        options: ["8.8.8.8", "172.16.5.4", "200.1.1.1", "11.0.0.1"],
        answer: 1,
        explanation: "172.16.0.0/12 is a private range, along with 10.0.0.0/8 and 192.168.0.0/16.",
      },
      {
        question: "TCP congestion control's slow start phase grows the congestion window:",
        options: ["Linearly per RTT", "Exponentially per RTT", "Only after packet loss", "It never changes"],
        answer: 1,
        explanation: "The window roughly doubles every round-trip time until it reaches the threshold.",
      },
      {
        question: "Which protocol automatically assigns IP addresses to hosts on a network?",
        options: ["DHCP", "ARP", "FTP", "SMTP"],
        answer: 0,
        explanation: "DHCP leases addresses and settings such as the gateway and DNS servers.",
      },
    ],
  },
  {
    slug: "csharp-interview-basics",
    title: "C# Interview Basics",
    topic: ".NET / OOP / Types",
    level: "Intermediate",
    tags: ["C#", ".NET", "OOP"],
    items: [
      {
        question: "Which of these C# types is a value type?",
        options: ["string", "int", "object", "List<int>"],
        answer: 1,
        explanation: "int (System.Int32) is a struct; string, object and List<T> are reference types.",
      },
      {
        question: "What does the 'sealed' keyword do on a class?",
        options: [
          "Makes all members static",
          "Prevents other classes from inheriting it",
          "Makes the class immutable",
          "Hides it from other assemblies",
        ],
        answer: 1,
        explanation: "A sealed class cannot be used as a base class.",
      },
      {
        question: "What is the main difference between an abstract class and an interface in C#?",
        options: [
          "An abstract class can hold instance fields and constructors; an interface cannot hold instance fields",
          "Interfaces support inheritance, abstract classes do not",
          "Abstract classes cannot have any implemented methods",
          "A class can inherit multiple abstract classes",
        ],
        answer: 0,
        explanation: "Interfaces can have default methods since C# 8, but still no instance state; a class can inherit only one base class.",
      },
      {
        question: "What happens when an int is assigned to a variable of type object?",
        options: ["Unboxing", "Boxing", "Casting fails at compile time", "Nothing; they are the same type"],
        answer: 1,
        explanation: "The value is copied into a new heap object, which is called boxing.",
      },
      {
        question: "Which statement about string in C# is true?",
        options: [
          "Strings are mutable",
          "Strings are immutable; operations return new strings",
          "string is a value type",
          "Strings cannot be compared with ==",
        ],
        answer: 1,
        explanation: "Methods like Replace return a new string; use StringBuilder for many edits.",
      },
      {
        question: "What does the 'using' statement guarantee for an IDisposable object?",
        options: [
          "It is never garbage collected",
          "Dispose() is called when the block exits, even on exceptions",
          "It is created on the stack",
          "It is thread-safe",
        ],
        answer: 1,
        explanation: "The compiler turns it into try/finally that calls Dispose().",
      },
      {
        question: "Which keyword allows a derived class to provide a new implementation of a base class method marked virtual?",
        options: ["new", "override", "base", "static"],
        answer: 1,
        explanation: "override replaces the virtual method so calls dispatch to the derived version at runtime.",
      },
      {
        question: "What is the difference between 'const' and 'readonly' fields?",
        options: [
          "const is set at compile time; readonly can be set at runtime in a constructor",
          "readonly is set at compile time; const at runtime",
          "They are identical",
          "const can only be used inside methods",
        ],
        answer: 0,
        explanation: "const values are baked into the compiled code; readonly fields are assigned once, at declaration or in a constructor.",
      },
      {
        question: "When does a LINQ query like list.Where(x => x > 5) actually run?",
        options: [
          "Immediately when Where is called",
          "When the result is enumerated, for example by foreach or ToList()",
          "At compile time",
          "Only inside an async method",
        ],
        answer: 1,
        explanation: "Most LINQ operators use deferred execution.",
      },
      {
        question: "What does 'await' do inside an async method?",
        options: [
          "Blocks the current thread until the task finishes",
          "Starts a new thread",
          "Pauses the method and returns control until the awaited task completes",
          "Runs the task synchronously",
        ],
        answer: 2,
        explanation: "The rest of the method resumes as a continuation without blocking the thread.",
      },
    ],
  },
];

export function getStaticQuiz(slug: string) {
  return staticQuizzes.find((quiz) => quiz.slug === slug);
}
