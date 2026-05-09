# Tempo (PT-BR)

Uma biblioteca leve e modular para interpretação de linguagem natural em português (PT-BR) para datas e intervalos. Inspirada no `hot-date`, o **Tempo** foi desenhado para ser "vendorizado" (copiado e colado) diretamente no seu projeto.

## 🚀 Funcionalidades

- **Linguagem Natural PT-BR:** Entende expressões como "hoje", "amanhã", "ontem", "daqui a 3 dias", "mês passado", etc.
- **Intervalos (Ranges):** Suporte a "segunda até sexta", "natal ... ano novo", "últimos 7 dias".
- **Aritmética de Datas:** "hoje + 3 dias", "ontem - 1 semana".
- **Datas Fixas e Feriados:** "natal", "páscoa", "carnaval", "dia das mães".
- **Resiliência:** Tolerância a erros de digitação (fuzzy matching) e abreviações (fds, hj).
- **Sem Dependências:** Construído puramente com TypeScript/JavaScript.

## 📦 Instalação

Esta biblioteca não está no NPM por design. Para usá-la:

1. Copie a pasta `src/` para o seu projeto (ex: `src/utils/tempo/`).
2. Importe a função principal:

```typescript
import { tempo } from './utils/tempo';

// Retorna YYYY-MM-DD ou YYYY-MM-DD/YYYY-MM-DD
const data = tempo('amanhã'); 
```

## 🛠 Exemplos de Uso

| Entrada | Resultado (Exemplo) |
| :--- | :--- |
| `hoje` | `2026-05-09` |
| `daqui a 2 semanas` | `2026-05-23` |
| `segunda antes do natal` | `2026-12-21` |
| `últimos 7 dias` | `2026-05-02/2026-05-09` |
| `fds` | `2026-05-09/2026-05-10` |

---

## 💻 Integração com Frameworks

### React

#### 1. Usando `useState` básico

```tsx
import React, { useState } from 'react';
import { tempo } from './tempo';

export function SimpleDateInput() {
  const [value, setValue] = useState('');
  const [parsed, setParsed] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    setParsed(tempo(input));
  };

  return (
    <div>
      <input value={value} onChange={handleChange} placeholder="Ex: amanhã" />
      {parsed && <p>Data Interpretada: {parsed}</p>}
    </div>
  );
}
```

#### 2. Com `React Hook Form`

```tsx
import { useForm } from 'react-hook-form';
import { tempo } from './tempo';

export function FormWithTempo() {
  const { register, watch } = useForm({
    defaultValues: { dateInput: '' }
  });
  
  const dateInput = watch('dateInput');
  const resolvedDate = tempo(dateInput);

  return (
    <form>
      <label>Data da Reserva:</label>
      <input {...register('dateInput')} placeholder="Ex: próxima sexta" />
      <input type="hidden" value={resolvedDate || ''} />
      
      {resolvedDate && <span>📅 {resolvedDate}</span>}
    </form>
  );
}
```

---

### Angular

#### 1. Angular 19+ (Sintaxe Moderna com Signals e `@`)

```typescript
import { Component, signal, computed } from '@angular/core';
import { tempo } from './tempo';

@Component({
  selector: 'app-date-input',
  template: `
    <div class="field">
      <input 
        [value]="rawInput()" 
        (input)="update($any($event).target.value)" 
        placeholder="Ex: daqui a 3 dias"
      />
      
      @if (resolvedDate()) {
        <div class="hint">Interpretado como: {{ resolvedDate() }}</div>
      } @else if (rawInput()) {
        <div class="error">Data inválida</div>
      }
    </div>
  `
})
export class DateInputComponent {
  rawInput = signal('');
  resolvedDate = computed(() => tempo(this.rawInput()));

  update(val: string) {
    this.rawInput.set(val);
  }
}
```

#### 2. Angular 17+ (Reactive Forms com `takeUntilDestroyed`)

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tempo } from './tempo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="dateControl" placeholder="Ex: natal">
    <p>ISO: {{ interpretedDate }}</p>
  `
})
export class DateFormComponent {
  dateControl = new FormControl('');
  interpretedDate: string | null = null;

  constructor() {
    this.dateControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        this.interpretedDate = tempo(val || '');
      });
  }
}
```

## 🧪 Testes

Para rodar a suite de testes unitários:

```bash
npm test
```

A biblioteca possui cobertura para casos extremos, gírias e ambiguidades, garantindo que a evolução do código não quebre resoluções críticas.

---
*Inspirado pelo projeto [hot-date](https://github.com/stolinski/hot-date).*
