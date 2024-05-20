import {Component, HostListener} from '@angular/core';
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

    setTimeout(() => {
      this.loaderShowed=false;
    }, 2000);

    setTimeout(() => {
      this.loader=false;
    }, 3000);
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

  loader = true;
  loaderShowed = true;

  form = this.fb.group({
    product: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  mainImageStyle: any;
  orderImageStyle: any;
 @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    this.mainImageStyle = { transform: "translate(" + ((e.clientX * 0.3) / 8) + "px," + ((e.clientY * 0.3) / 8 ) + "px)"}
   this.orderImageStyle = { transform: "translate(-" + ((e.clientX * 0.3) / 8) + "px,-" + ((e.clientY * 0.3) / 8 ) + "px)"}
  }


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

