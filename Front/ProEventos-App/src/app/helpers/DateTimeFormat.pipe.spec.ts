import { TestBed, waitForAsync } from '@angular/core/testing';
import { DateTimeFormatPipe } from './DateTimeFormat.pipe';

describe('Pipe: DateTimeFormatPipe', () => {
  it('create an instance', () => {
    let pipe = new DateTimeFormatPipe('pt-BR');
    expect(pipe).toBeTruthy();
  });
});