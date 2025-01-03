## TypeORM 학습 테스트

### TypeORM에 없는 내용

#### PrimaryColumn

별도의 pk값을 할당하지 않아도 자동적으로 값을 생성한다. 속성 타입이 number일 때 기준

#### 1:1 join에서 상위 엔티티와 하위 엔티티 pk값 동기화

양방향 단방향 상관없이 제일 이상적인 방법은

- 같은 값을 pk로 할당
- 상위 엔티티 저장후 해당 엔티티 인스턴스의 pk값을 하위 엔티티에 할당

- 모든 엔티티의 pk가 PrimaryColumn인 경우
  1. 같은 값을 pk로 할당
  2. 상위 엔티티 저장후 해당 엔티티 인스턴스의 pk값을 하위 엔티티에 할당
- 상위 엔티티의 pk가 PrimaryGeneratedColumn이고 하위 엔티티의 pk가 PrimaryColumn인 경우
  1. 상위 엔티티 저장후 해당 엔티티 인스턴스의 pk값을 하위 엔티티에 할당
  2. 같은 값을 pk로 할당

엔티티가 2개 1:1 관계의 경우 일일히 pk를 설정하지 않아도 문제가 발생하지 않지만 엔티티의 1:1 관계가 3개 이상으로 엔티티가 늘어나거나 다른것과 햇갈릴 가능성이 있기 때문에 위의 2개 방법을 사용할 것을 추천한다.
