# 面向对象——07.类与类之间的交互关系

类与类之间都有哪些交互关系呢？UML 统一建模语言中定义了六种类之间的关系。它们分别是：泛化、实现、关联、聚合、组合、依赖。关系比较多，而且有些还比较相近，比如聚合和组合，接下来就逐一举例讲解一下。

## 泛化

**泛化**（Generalization）可以简单理解为继承关系。具体到 Java 代码就是下面这样：

```java
public class A { ... }
public class B extends A { ... }
```

## 实现

**实现**（Realization）一般是指接口和实现类之间的关系。具体到 Java 代码就是下面这样：

```java
public interface A {...}
public class B implements A { ... }
```

## 聚合

**聚合**（Aggregation）是一种包含关系，A 类对象包含 B 类对象，B 类对象的生命周期可以不依赖 A 类对象的生命周期，也就是说可以单独销毁 A 类对象而不影响 B 对象，比如课程与学生之间的关系。具体到 Java 代码就是下面这样：

```java
public class A {
  private B b;
  public A(B b) {
    this.b = b;
  }
}
```

## 组合

**组合**（Composition）也是一种包含关系。A 类对象包含 B 类对象，B 类对象的生命周期依赖 A 类对象的生命周期，B 类对象不可单独存在，比如鸟与翅膀之间的关系。具体到 Java 代码就是下面这样：

```java
public class A {
  private B b;
  public A() {
    this.b = new B();
  }
}
```

## 关联

**关联**（Association）是一种非常弱的关系，包含聚合、组合两种关系。具体到代码层面，如果 B 类对象是 A 类的成员变量，那 B 类和 A 类就是关联关系。具体到 Java 代码就是下面这样：

```java
public class A {
  private B b;
  public A(B b) {
    this.b = b;
  }
}
// 或者
public class A {
  private B b;
  public A() {
    this.b = new B();
  }
}
```

## 依赖

**依赖**（Dependency）是一种比关联关系更加弱的关系，包含关联关系。不管是 B 类对象是 A 类对象的成员变量，还是 A 类的方法使用 B 类对象作为参数或者返回值、局部变量，只要 B 类对象和 A 类对象有任何使用关系，我们都称它们有依赖关系。具体到 Java 代码就是下面这样：

```java
public class A {
  private B b;
  public A(B b) {
    this.b = b;
  }
}
// 或者
public class A {
  private B b;
  public A() {
    this.b = new B();
  }
}
// 或者
public class A {
  public void func(B b) { ... }
}
```

以上就是类与类之间的六种关系，根据例子去理解的话并不复杂。

另外，需要注意的是之前提到过的“多用组合少用继承”里的组合，其实是将这里的聚合、组合、关联三种关系统称为组合关系。