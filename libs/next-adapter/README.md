<div align="center">
  <h1 style="margin: 0;">Next-Adapter</h1>
  <p>Render Module to add Nextjs support for Nestjs</p>
</div>

> This project is mainly borrowed from https://github.com/kyle-mccarthy/nest-next, But there are [other optimizations](https://github.com/skywalker512/towerlight/commits/main/libs/next-adapter)

> Next-Adapter provides a nestjs module to integrate next.js into a nest.js application, it allows the rendering of next.js pages via nestjs controllers and providing initial props to the page as well

### Usage

Import the RenderModule into your application's root module and call the
forRootAsync method.

```ts
import { Module } from '@nestjs/common';
import { NextAdapterModule } from '@towerlight/nest-next-adapter';

@Module({
  imports: [
    NextAdapterModule.forRoot({
      nextServerOption: {
        customServer: true,
        conf: {},
        dev: true,
        dir: resolve(__dirname, '../forum'),
      },
      rendererOptions: {
        viewsDir: '',
        dev: true,
      },
    }),
  ],
  ...
})
export class AppModule {
}
```

Also, you can use **useFactory** to set up dynamic configuration

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NextAdapterModule } from '@towerlight/nest-next-adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ...
    }),
    NextAdapterModule.forRoot({
      nextServerOption: {
        customServer: true,
        conf: {},
        dev: !configService.get<boolean>('production'),
        dir: resolve(
          __dirname,
          configService.get<boolean>('production')
            ? '../forum'
            : '../../../apps/forum'
        ),
      },
      rendererOptions: {
        viewsDir: '',
        dev: !configService.get<boolean>('production'),
      },
    }),
  ],
  ...
})

export class AppModule {
}
```

### Configuration

The RenderModule accepts configuration

```ts
export interface NextAdapterModuleOptions {
  nextServerOption: ServerConstructor;
  rendererOptions: Partial<RendererConfig>;
}

export declare type ServerConstructor = {
  /**
   * Where the Next project is located - @default '.'
   */
  dir?: string;
  /**
   * Hide error messages containing server information - @default false
   */
  quiet?: boolean;
  /**
   * Object what you would use in next.config.js - @default {}
   */
  conf?: NextConfig;
  dev?: boolean;
  customServer?: boolean;
};

export interface RendererConfig {
  /**
   * The viewsDir option determines the folder inside of pages to render from. By default the value is /views
   * but this can be changed or set to null or '' to render from the root of pages.
   */
  viewsDir: null | string;
  /**
   * By default the dev mode will be set to true unless the option is overwritten.
   * Currently the dev mode determines how the errors should be serialized before being sent to next.
   */
  dev: boolean;
}
```

### Rendering Pages

The `NextAdapterModule` overrides the Express/Fastify render. To render a page
in your controller import the Render decorator from `@nestjs/common` and add
it to the method that will render the page. The path for the page is relative
to the `/pages` directory.

```ts
import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  @Render('Index')
  public index() {
    // initial props
    return {
      title: 'Next with Nest',
    };
  }
}
```

Additionally, the render function is made available on the res object.

```ts
@Controller()
export class AppController {

  @Get()
  public index(@Res() res: RenderableResponse) {
    res.render('Index', {
      title: 'Next with Nest',
    });
  }
}
```

The render function takes in the view, as well as the initial props passed to
the page.

```ts
render = (view: string, initialProps?: any) => any
```

### Rendering the initial props

The initial props sent to the next.js view page can be accessed from the
context's query method inside the getInitialProps method.

```ts
import { NextPage, NextPageContext } from 'next'

// The component's props type
type PageProps = {
  title: string
}

// extending the default next context type
type PageContext = NextPageContext & {
  query: PageProps
}

// react component
const Page: NextPage<PageProps> = ({ title }) => {
  return (
    <div>
      <h1>{ title } < /h1>
    < /div>
  )
}

// assigning the initial props to the component's props
export async function getServerSideProps(context) {
  if (context.req) {
    return {
      props: {
        ...context.query
      }
    }
  }
  return {
    props: { title: 'from client' }, // will be passed to the page component as props
  }
}

export default Page
```

### TIPS

Because the back-end project will be restarted after it is code changed, and
at the same time next.js It will also compile again, which will waste a lot of
time.

Here, we
use [hot reload](https://github.com/skywalker512/towerlight/blob/08deb7d27ff82833f36b79d7585d1ba050d06927/apps/main/webpack.hmr.config.js)
, and ensure that the next.js is a singleton which always exists.
