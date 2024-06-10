new Vue({
    el: '#app',
    data: {
      nuevaTransaccion: {
        monto: '',
        tipo: '',
        descripcion: '',
        fecha: ''
      },
      transacciones: []
    },
    methods: {
      agregarTransaccion() {
        this.transacciones.push({ ...this.nuevaTransaccion });
        this.nuevaTransaccion.monto = '';
        this.nuevaTransaccion.tipo = '';
        this.nuevaTransaccion.descripcion = '';
        this.nuevaTransaccion.fecha = '';
        this.actualizarGrafico(); 
      },
      eliminarTransaccion(index) {
        this.transacciones.splice(index, 1);
        this.actualizarGrafico(); 
      },
      actualizarGrafico() {
        if (this.grafico) {
          this.grafico.data = this.datosGrafico;
          this.grafico.update();
        } else {
          this.crearGrafico();
        }
      },
      crearGrafico() {
        const ctx = document.getElementById('graficaGastos').getContext('2d');
        this.grafico = new Chart(ctx, {
          type: 'bar',
          data: this.datosGrafico,
          options: {
            responsive: true,
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true
              }
            }
          }
        });
      }
    },
    computed: {
      transaccionesConAnio() {
        return this.transacciones.map(transaccion => ({
          ...transaccion,
          anio: new Date(transaccion.fecha).getFullYear()
        }));
      },
      datosGrafico() {
        const datos = this.transaccionesConAnio.reduce((acc, transaccion) => {
          const año = transaccion.anio;
          if (!acc[año]) {
            acc[año] = { ingreso: 0, gasto: 0 };
          }
          if (transaccion.tipo === 'ingreso') {
            acc[año].ingreso += parseFloat(transaccion.monto);
          } else if (transaccion.tipo === 'gasto') {
            acc[año].gasto += parseFloat(transaccion.monto);
          }
          return acc;
        }, {});
  
        const años = Object.keys(datos);
        const ingresos = años.map(año => datos[año].ingreso);
        const gastos = años.map(año => datos[año].gasto);
  
        return {
          labels: años,
          datasets: [
            {
              label: 'Ingresos',
              data: ingresos,
              backgroundColor: 'rgba(75, 192, 192, 0.6)'
            },
            {
              label: 'Gastos',
              data: gastos,
              backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }
          ]
        };
      }
    },
    mounted() {
      this.crearGrafico(); // Crear el gráfico cuando el componente se monta
    }
  });
  
