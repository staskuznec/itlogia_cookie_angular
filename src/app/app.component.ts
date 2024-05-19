import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  course = {"rub": 0, "byn": 0, "eur": 0, "cny": 0};
  // загружаем курсы валют
  ngOnInit() {
    // загружаем курсы валют
    this.http.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
      .subscribe((data: any) => {
        this.course = data.usd;
      })
    // загружаем товары
    this.http.get("https://testologia.ru/cookies")
      .subscribe(data => {
        this.productsData = data;
      })
  }
  currency = '$';
  productsData: any;


  form = this.fb.group({
    product: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });
  constructor(private fb: FormBuilder, private http: HttpClient) {}
 scrollTo(target : HTMLElement, product: any) {
    target.scrollIntoView({behavior: 'smooth'});
    if (product) {
      this.form.patchValue({product: product.title + ' (' + product.price + ' ' + this.currency + ')'});
    }
  }


changeCurrency() {
    let newCurrency = '$'
    let coefficient = 1
    if (this.currency === '$') {
      newCurrency = '₽';
      coefficient = this.course.rub;
    } else if (this.currency === '₽') {
      newCurrency = 'BYN';
      coefficient = this.course.byn;
    } else if (this.currency === 'BYN') {
      newCurrency = '€';
      coefficient = this.course.eur;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = this.course.cny;
    }


    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      let price = item.basePrice * coefficient;
      // округляем до 1 знака после запятой
      item.price = price.toFixed(1);
    })
  }

  confirmOrder() {
    if (this.form.valid) {
      this.http.post("https://testologia.ru/cookies-order", this.form.value)
        .subscribe( {
          next: (response: any) => {
            alert(response.message)
            this.form.reset()
          },
          error: (response: any) => {
            alert(response.error.message)
          }
        });


    }
  }


  switchSugarFree(e: any) {
    this.http.get("https://testologia.ru/cookies" + (e.currentTarget.checked ? '?sugarfree' : ''))
      .subscribe(data => this.productsData = data);
  }
}

